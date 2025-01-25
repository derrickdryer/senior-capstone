const request = require('supertest');
const schemas = require('../scripts/db/schemas.json').schemas;

const host = 'localhost';
const port = 3000;
const baseUrl = `http://${host}:${port}/api`;

const createdIds: Record<string, any> = {};

// ** Generate Default Data from Schema **
const generateObjectFromSchema = (endpoint: string, schema: Record<string, string>) => {
    if (!schema) {
      throw new Error(`Schema is undefined for ${endpoint}. Check schemas.json.`);
    }
  
    const obj: Record<string, any> = {};
  
    Object.keys(schema).forEach((field) => {
      const fieldType = schema[field];
  
      if (field.endsWith('_id') || field === 'id' || field === 'created_at' || field === 'updated_at') {
        return; 
      }
  
      if (fieldType.startsWith('VARCHAR') || fieldType === 'TEXT') {
        obj[field] = `test-${Date.now()}`.slice(0, parseInt(fieldType.match(/\d+/)?.[0] || '255'));
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
  
    // ** Assign Dependencies **
    if (endpoint === 'apartments') {
      if (!createdIds['assets']) throw new Error(`❌ Missing asset_id for apartments.`);
      obj.property_id = createdIds['assets'];
      obj.bedrooms = 2.0;  
      obj.bathrooms = 1.5; 
    } else if (endpoint === 'leases') {
      if (!createdIds['tenants']) throw new Error(`❌ Missing tenant_id for leases.`);
      if (!createdIds['apartments']) throw new Error(`❌ Missing apartment_id for leases.`);
      obj.tenant_id = createdIds['tenants'];
      obj.apartment_id = createdIds['apartments'];
      obj.status = 'active'; 
    } else if (endpoint === 'payments') {
      if (!createdIds['leases']) throw new Error(`❌ Missing lease_id for payments.`);
      obj.lease_id = createdIds['leases'];
      obj.payment_method = 'credit_card';  
      obj.status = 'completed';  
    } else if (endpoint === 'maintenance-requests') {
      if (!createdIds['tenants']) throw new Error(`❌ Missing tenant_id for maintenance_requests.`);
      if (!createdIds['apartments']) throw new Error(`❌ Missing apartment_id for maintenance_requests.`);
      obj.tenant_id = createdIds['tenants'];
      obj.apartment_id = createdIds['apartments'];
      obj.status = 'pending'; 
    } else if (endpoint === 'notifications') {
      if (!createdIds['users']) throw new Error(`❌ Missing user_id for notifications.`);
      obj.user_id = createdIds['users'];
    } else if (endpoint === 'inquiries') {
      if (!createdIds['tenants']) throw new Error(`❌ Missing tenant_id for inquiries.`);
      if (!createdIds['assets']) throw new Error(`❌ Missing property_id for inquiries.`);
      if (!createdIds['apartments']) throw new Error(`❌ Missing apartment_id for inquiries.`);
      obj.tenant_id = createdIds['tenants'];
      obj.property_id = createdIds['assets'];
      obj.apartment_id = createdIds['apartments'];
    }
  
    return obj;
  };
  
  

// ** CRUD Request Helpers **
const postRequest = async (endpoint: string, data: any) => {
    try {
      console.log(`🔄 Creating ${endpoint} with data:`, JSON.stringify(data, null, 2));
  
      const response = await request(baseUrl)
        .post(`/${endpoint}`)
        .send(data)
        .expect(201); 
  
      console.log(`✅ Created ${endpoint}:`, response.body);
  
      const created = response.body;
      const primaryKey = Object.keys(created).find((k) => k.endsWith('_id')) ?? 'id';
  
      if (created[primaryKey]) {
        createdIds[endpoint] = created[primaryKey];
      } else {
        throw new Error(`❌ API response for ${endpoint} is missing an ID field. Response: ${JSON.stringify(created)}`);
      }
  
      return created;
    } catch (error) {
      console.error(`🚨 ERROR CREATING ${endpoint}`, error.response?.body || error.message);
      throw error;
    }
  };
  

const getRequest = async (endpoint: string, id: any) => {
  await request(baseUrl).get(`/${endpoint}/${id}`).expect(200);
};

const putRequest = async (endpoint: string, id: any, data: any) => {
  await request(baseUrl).put(`/${endpoint}/${id}`).send(data).expect(200);
};

const deleteRequest = async (endpoint: string, id: any) => {
  await request(baseUrl).delete(`/${endpoint}/${id}`).expect(200);
};

const listRequest = async (endpoint: string) => {
  await request(baseUrl).get(`/${endpoint}`).expect(200);
};

const orderedSchemas = [
    'assets',      
    'users',          
    'apartments',    
    'tenants',       
    'leases',         
    'payments',      
    'maintenance-requests',
    'notifications', 
    'inquiries'      
  ];

describe('CRUD Tests for All Schemas (Fixed Version)', () => {
  orderedSchemas.forEach((endpoint) => {
    test(`List ${endpoint}`, async () => {
      await listRequest(endpoint);
    });
  });

  // ** Create in correct order **
  orderedSchemas.forEach((endpoint) => {
    test(`Create ${endpoint}`, async () => {
      if (!schemas[endpoint]) {
        throw new Error(`Schema for ${endpoint} is missing in schemas.json.`);
      }

      const createObject = generateObjectFromSchema(endpoint, schemas[endpoint]);

      await postRequest(endpoint, createObject);
    });
  });

  // ** Read **
  orderedSchemas.forEach((endpoint) => {
    test(`Read ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}. Ensure it was created successfully.`);
      }
      await getRequest(endpoint, createdIds[endpoint]);
    });
  });

  // ** Update **
  orderedSchemas.forEach((endpoint) => {
    test(`Update ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}. Ensure it was created successfully.`);
      }
      const updateObject = generateObjectFromSchema(endpoint, schemas[endpoint]);
      await putRequest(endpoint, createdIds[endpoint], updateObject);
    });
  });

  // ** Delete in reverse order **
  orderedSchemas.reverse().forEach((endpoint) => {
    test(`Delete ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}. Ensure it was created successfully.`);
      }
      await deleteRequest(endpoint, createdIds[endpoint]);
    });
  });
});
