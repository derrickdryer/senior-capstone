const request = require('supertest');
const schemas = require('../scripts/db/schemas.json').schemas; // Load schemas.json

const host = 'localhost';
const port = 3000;
const baseUrl = `http://${host}:${port}/api`;

const createdIds: Record<string, any> = {};

// ** Generate Default Data from Schema **
const generateObjectFromSchema = (schema: Record<string, string>) => {
  if (!schema) {
    throw new Error(`Schema is undefined. Check schemas.json for missing definitions.`);
  }

  const obj: Record<string, any> = {};

  Object.keys(schema).forEach((field) => {
    const fieldType = schema[field];

    if (field.endsWith('_id') || field === 'id' || field === 'created_at' || field === 'updated_at') {
      return; // Skip ID and timestamps (auto-generated)
    }

    if (fieldType.startsWith('VARCHAR') || fieldType === 'TEXT') {
      obj[field] = `test-${Date.now()}`.slice(0, parseInt(fieldType.match(/\d+/)?.[0] || '255')); // Limit length
    } else if (fieldType.startsWith('DECIMAL') || fieldType === 'INT') {
      obj[field] = 12345;
    } else if (fieldType === 'BOOLEAN') {
      obj[field] = true;
    } else if (fieldType.startsWith('ENUM')) {
      obj[field] = fieldType.match(/\('([^']*)'/)?.[1] || 'default'; // Pick first ENUM value
    } else if (fieldType === 'DATE') {
      obj[field] = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
  });

  return obj;
};

// ** CRUD Request Helpers **
const postRequest = async (endpoint: string, data: any) => {
  const response = await request(baseUrl)
    .post(`/${endpoint}`)
    .send(data)
    .expect(201); // Expect "Created"

  const created = response.body;

  // Ensure we correctly extract the primary key
  const primaryKey = Object.keys(created).find((k) => k.endsWith('_id')) ?? 'id';

  // Only store ID if it exists in response
  if (created[primaryKey]) {
    createdIds[endpoint] = created[primaryKey];
  } else {
    throw new Error(`❌ API response for ${endpoint} is missing an ID field. Response: ${JSON.stringify(created)}`);
  }

  return created;
};

const getRequest = async (endpoint: string, id: any) => {
  await request(baseUrl).get(`/${endpoint}/${id}`).expect(200); // Expect "OK"
};

const putRequest = async (endpoint: string, id: any, data: any) => {
  await request(baseUrl).put(`/${endpoint}/${id}`).send(data).expect(200); // Expect "OK"
};

const deleteRequest = async (endpoint: string, id: any) => {
  await request(baseUrl).delete(`/${endpoint}/${id}`).expect(200); // Expect "OK"
};

const listRequest = async (endpoint: string) => {
  await request(baseUrl).get(`/${endpoint}`).expect(200); // Expect "OK"
};

describe('CRUD Tests for All Schemas (Only Checking Response Codes)', () => {
  // ** Ensure correct order of creation based on dependencies **
  const orderedSchemas = [
    'assets', 
    'users',
    'apartments', 
    'tenants', 
    'leases', 
    'payments',
    'maintenance-requests',  // ✅ Fixed naming
    'notifications',
    'inquiries'
  ];

  // ** List All **
  orderedSchemas.forEach((endpoint) => {
    test(`List ${endpoint}`, async () => {
      await listRequest(endpoint);
    });
  });

  // ** Create in correct order **
  orderedSchemas.forEach((endpoint) => {
    test(`Create ${endpoint}`, async () => {
      if (!schemas[endpoint]) {
        throw new Error(`❌ Schema for ${endpoint} is missing in schemas.json.`);
      }

      const createObject = generateObjectFromSchema(schemas[endpoint]);

      // Inject dependencies manually
      if (endpoint === 'apartments') {
        createObject.asset_id = createdIds['assets']; // ✅ Fixed naming
      } else if (endpoint === 'leases') {
        createObject.tenant_id = createdIds['tenants'];
        createObject.apartment_id = createdIds['apartments'];
      } else if (endpoint === 'payments') {
        createObject.lease_id = createdIds['leases'];
      } else if (endpoint === 'maintenance_requests') {
        createObject.tenant_id = createdIds['tenants'];
        createObject.apartment_id = createdIds['apartments'];
      } else if (endpoint === 'notifications') {
        createObject.user_id = createdIds['users'];
      } else if (endpoint === 'inquiries') {
        createObject.tenant_id = createdIds['tenants'];
        createObject.asset_id = createdIds['assets'];
        createObject.apartment_id = createdIds['apartments'];
      }

      await postRequest(endpoint, createObject);
    });
  });

  // ** Read **
  orderedSchemas.forEach((endpoint) => {
    test(`Read ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`❌ No ID found for ${endpoint}. Make sure it was created successfully.`);
      }
      await getRequest(endpoint, createdIds[endpoint]);
    });
  });

  // ** Update **
  orderedSchemas.forEach((endpoint) => {
    test(`Update ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`❌ No ID found for ${endpoint}. Make sure it was created successfully.`);
      }
      const updateObject = generateObjectFromSchema(schemas[endpoint]);
      await putRequest(endpoint, createdIds[endpoint], updateObject);
    });
  });

  // ** Delete in reverse order to avoid dependencies **
  orderedSchemas.reverse().forEach((endpoint) => {
    test(`Delete ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`❌ No ID found for ${endpoint}. Make sure it was created successfully.`);
      }
      await deleteRequest(endpoint, createdIds[endpoint]);
    });
  });
});
