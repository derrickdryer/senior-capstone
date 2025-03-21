// ======================================================================
// File: utils.test.ts
// Description: This test suite verifies CRUD operations for API endpoints
//              based on the schema definitions provided in schemas.json.
//              Utility functions generate test data dynamically based on the schema.
// Dependencies: supertest for API requests, schemas from schemas.json.
// Usage: Run this test to validate the API endpoints for assets, users, apartments,
//        tenants, leases, payments, maintenance requests, notifications, and inquiries.
// ======================================================================

const request = require('supertest');
const schemas = require('../scripts/db/schemas.json').schemas;
const baseUrl = `https://demo.hidden.it.com/api`;

const createdIds: Record<string, any> = {};

// Generate Default Data from Schema: creates a test object based on the provided schema.
const generateObjectFromSchema = (
  endpoint: string,
  schema: Record<string, string>
) => {
  if (!schema) {
    throw new Error(`Schema is undefined for ${endpoint}. Check schemas.json.`);
  }

  const obj: Record<string, any> = {};

  Object.keys(schema).forEach((field) => {
    const fieldType = schema[field];

    // Skip auto-generated or non-editable fields.
    if (
      field.endsWith('_id') ||
      field === 'id' ||
      field === 'created_at' ||
      field === 'updated_at'
    ) {
      return;
    }

    // Generate test data based on the field's type.
    if (fieldType.startsWith('VARCHAR') || fieldType === 'TEXT') {
      obj[field] = `test-${Date.now()}`.slice(
        0,
        parseInt(fieldType.match(/\d+/)?.[0] || '255')
      );
    } else if (fieldType.startsWith('DECIMAL')) {
      obj[field] = parseFloat((Math.random() * 5).toFixed(1));
    } else if (fieldType === 'INT') {
      obj[field] = Math.floor(Math.random() * 1000);
    } else if (fieldType === 'BOOLEAN') {
      obj[field] = Math.random() < 0.5;
    } else if (fieldType.startsWith('ENUM')) {
      obj[field] = fieldType.match(/\('([^']*)'/)?.[1] || 'default';
    } else if (fieldType === 'DATE') {
      obj[field] = new Date().toISOString().split('T')[0];
    }
  });

  // Assign dependencies based on the endpoint type.
  if (endpoint === 'apartments') {
    if (!createdIds['assets'])
      throw new Error(`❌ Missing asset_id for apartments.`);
    obj.property_id = createdIds['assets'];
    obj.bedrooms = 2.0;
    obj.bathrooms = 1.5;
  } else if (endpoint === 'leases') {
    if (!createdIds['tenants'])
      throw new Error(`❌ Missing tenant_id for leases.`);
    if (!createdIds['apartments'])
      throw new Error(`❌ Missing apartment_id for leases.`);
    obj.tenant_id = createdIds['tenants'];
    obj.apartment_id = createdIds['apartments'];
    obj.status = 'active';
  } else if (endpoint === 'payments') {
    if (!createdIds['leases'])
      throw new Error(`❌ Missing lease_id for payments.`);
    obj.lease_id = createdIds['leases'];
    obj.payment_method = 'credit_card';
    obj.status = 'completed';
  } else if (endpoint === 'maintenance-requests') {
    if (!createdIds['tenants'])
      throw new Error(`❌ Missing tenant_id for maintenance_requests.`);
    if (!createdIds['apartments'])
      throw new Error(`❌ Missing apartment_id for maintenance_requests.`);
    obj.tenant_id = createdIds['tenants'];
    obj.apartment_id = createdIds['apartments'];
    obj.status = 'pending';
  } else if (endpoint === 'notifications') {
    if (!createdIds['users'])
      throw new Error(`❌ Missing user_id for notifications.`);
    obj.user_id = createdIds['users'];
  } else if (endpoint === 'inquiries') {
    if (!createdIds['tenants'])
      throw new Error(`❌ Missing tenant_id for inquiries.`);
    if (!createdIds['assets'])
      throw new Error(`❌ Missing property_id for inquiries.`);
    if (!createdIds['apartments'])
      throw new Error(`❌ Missing apartment_id for inquiries.`);
    obj.tenant_id = createdIds['tenants'];
    obj.property_id = createdIds['assets'];
    obj.apartment_id = createdIds['apartments'];
  }

  return obj;
};

// CRUD Request Helpers: functions to abstract HTTP operations
const postRequest = async (endpoint: string, data: any) => {
  try {
    console.log(
      `🔄 Creating ${endpoint} with data:`,
      JSON.stringify(data, null, 2)
    );

    const response = await request(baseUrl)
      .post(`/${endpoint}`)
      .send(data)
      .expect(201);

    console.log(`✅ Created ${endpoint}:`, response.body);

    const created = response.body;
    const primaryKey =
      Object.keys(created).find((k) => k.endsWith('_id')) ?? 'id';

    if (created[primaryKey]) {
      createdIds[endpoint] = created[primaryKey];
    } else {
      throw new Error(
        `❌ API response for ${endpoint} is missing an ID field. Response: ${JSON.stringify(
          created
        )}`
      );
    }

    return created;
  } catch (error) {
    console.error(
      `🚨 ERROR CREATING ${endpoint}`,
      error.response?.body || error.message
    );
    throw error;
  }
};

const getRequest = async (endpoint: string, id: any) => {
  // Retrieve a resource by its ID.
  await request(baseUrl).get(`/${endpoint}/${id}`).expect(200);
};

const putRequest = async (endpoint: string, id: any, data: any) => {
  // Update a resource by its ID.
  await request(baseUrl).put(`/${endpoint}/${id}`).send(data).expect(200);
};

const deleteRequest = async (endpoint: string, id: any) => {
  // Delete a resource by its ID.
  await request(baseUrl).delete(`/${endpoint}/${id}`).expect(200);
};

const listRequest = async (endpoint: string) => {
  // List all resources for an endpoint.
  await request(baseUrl).get(`/${endpoint}`).expect(200);
};

// Define the order in which schemas are processed.
const orderedSchemas = [
  'assets',
  'users',
  'apartments',
  'tenants',
  'leases',
  'payments',
  'maintenance-requests',
  'notifications',
];

describe('CRUD Tests for All Schemas (Fixed Version)', () => {
  // Test listing resources.
  orderedSchemas.forEach((endpoint) => {
    test(`List ${endpoint}`, async () => {
      await listRequest(endpoint);
    });
  });

  // Test creation of resources in the correct dependency order.
  orderedSchemas.forEach((endpoint) => {
    test(`Create ${endpoint}`, async () => {
      if (!schemas[endpoint]) {
        throw new Error(`Schema for ${endpoint} is missing in schemas.json.`);
      }

      const createObject = generateObjectFromSchema(
        endpoint,
        schemas[endpoint]
      );

      await postRequest(endpoint, createObject);
    });
  });

  // Test read operations.
  orderedSchemas.forEach((endpoint) => {
    test(`Read ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(
          `No ID found for ${endpoint}. Ensure it was created successfully.`
        );
      }
      await getRequest(endpoint, createdIds[endpoint]);
    });
  });

  // Test update operations.
  orderedSchemas.forEach((endpoint) => {
    test(`Update ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(
          `No ID found for ${endpoint}. Ensure it was created successfully.`
        );
      }
      const updateObject = generateObjectFromSchema(
        endpoint,
        schemas[endpoint]
      );
      await putRequest(endpoint, createdIds[endpoint], updateObject);
    });
  });

  // Test deletion of resources in reverse order.
  orderedSchemas.reverse().forEach((endpoint) => {
    test(`Delete ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(
          `No ID found for ${endpoint}. Ensure it was created successfully.`
        );
      }
      await deleteRequest(endpoint, createdIds[endpoint]);
    });
  });
});
