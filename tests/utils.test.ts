const request = require('supertest');
const schemas = require('../scripts/db/schemas.json').schemas;
const baseUrl = `https://demo.hidden.it.com/api`;

let authToken: string;
const createdIds: Record<string, any> = {};

const generateObjectFromSchema = (endpoint: string, schema: Record<string, string>) => {
  if (!schema) {
    throw new Error(`Schema is undefined for ${endpoint}.`);
  }
  if (endpoint === 'users') {
    return {
      role: "tenant",
      username: "manager12345",
      password: "passworddddd",
      email: "manager18888@example.com"
    };
  }
  const obj: Record<string, any> = {};
  Object.keys(schema).forEach((field) => {
    const fieldType = schema[field];
    if (field.endsWith('_id') || field === 'id' || field === 'created_at' || field === 'updated_at') {
      return;
    }
    if (field === 'email') {
      obj[field] = `test-${Date.now()}@example.com`;
      return;
    }
    if (field === 'phone_number') {
      obj[field] = `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      return;
    }
    if (field === 'password') {
      obj[field] = `password${Math.floor(Math.random() * 1000)}`;
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
      const possibleEnumValue = fieldType.match(/\('([^']*)'/)?.[1] || 'default';
      obj[field] = possibleEnumValue;
    } else if (fieldType === 'DATE') {
      obj[field] = new Date().toISOString().split('T')[0];
    }
  });
  if (endpoint === 'apartments') {
    if (!createdIds['assets']) {
      throw new Error(`Missing asset_id for apartments.`);
    }
    obj.property_id = createdIds['assets'];
    obj.bedrooms = 2.0;
    obj.bathrooms = 1.5;
  } else if (endpoint === 'leases') {
    if (!createdIds['tenants']) {
      throw new Error(`Missing tenant_id for leases.`);
    }
    if (!createdIds['apartments']) {
      throw new Error(`Missing apartment_id for leases.`);
    }
    obj.tenant_id = createdIds['tenants'];
    obj.apartment_id = createdIds['apartments'];
    obj.status = 'active';
  } else if (endpoint === 'payments') {
    if (!createdIds['leases']) {
      throw new Error(`Missing lease_id for payments.`);
    }
    obj.lease_id = createdIds['leases'];
    obj.payment_method = 'credit_card';
    obj.status = 'completed';
  } else if (endpoint === 'maintenance-requests') {
    if (!createdIds['tenants']) {
      throw new Error(`Missing tenant_id for maintenance_requests.`);
    }
    if (!createdIds['apartments']) {
      throw new Error(`Missing apartment_id for maintenance_requests.`);
    }
    obj.tenant_id = createdIds['tenants'];
    obj.apartment_id = createdIds['apartments'];
    obj.status = 'pending';
  } else if (endpoint === 'inquiries') {
    if (!createdIds['tenants']) {
      throw new Error(`Missing tenant_id for inquiries.`);
    }
    if (!createdIds['assets']) {
      throw new Error(`Missing property_id for inquiries.`);
    }
    if (!createdIds['apartments']) {
      throw new Error(`Missing apartment_id for inquiries.`);
    }
    obj.tenant_id = createdIds['tenants'];
    obj.property_id = createdIds['assets'];
    obj.apartment_id = createdIds['apartments'];
  }
  return obj;
};

const getUpdateObject = (endpoint: string, schema: Record<string, string>) => {
  if (endpoint === 'assets') {
    return {
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      postal_code: "62701",
      num_apartments: 10,
      is_available: 1
    };
  }
  if (endpoint === 'apartments') {
    return {
      bathrooms: 1,
      bedrooms: 1,
      floor: 2,
      is_available: 1,
      property_id: 2,
      rent_amount: 900,
      square_footage: 650,
      unit_number: "2A"
    };
  }
  return generateObjectFromSchema(endpoint, schema);
};

const postRequest = async (endpoint: string, data: any) => {
  const response = await request(baseUrl)
    .post(`/${endpoint}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send(data)
    .expect(201);
  const created = response.body;
  const primaryKey = Object.keys(created).find((k) => k.endsWith('_id')) ?? 'id';
  if (created[primaryKey]) {
    createdIds[endpoint] = created[primaryKey];
  } else {
    throw new Error(`API response for ${endpoint} is missing an ID field. Response: ${JSON.stringify(created)}`);
  }
  return created;
};

const getRequest = async (endpoint: string, id: any) => {
  await request(baseUrl)
    .get(`/${endpoint}/${id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
};

const putRequest = async (endpoint: string, id: any, data: any) => {
  await request(baseUrl)
    .put(`/${endpoint}/${id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send(data)
    .expect(200);
};

const deleteRequest = async (endpoint: string, id: any) => {
  await request(baseUrl)
    .delete(`/${endpoint}/${id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
};

const listRequest = async (endpoint: string) => {
  await request(baseUrl)
    .get(`/${endpoint}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
};

const orderedSchemas = [
  'assets',
  'users',
  'apartments',
  'tenants',
  'leases',
  'payments',
  'maintenance-requests',
];

beforeAll(async () => {
  const loginResponse = await request(baseUrl)
    .post('/login')
    .send({
      username: 'manager1',
      password: 'password1',
    })
    .expect(200);
  authToken = loginResponse.body.token;
  if (!authToken) {
    throw new Error('Failed to obtain auth token from login response.');
  }
});

describe('CRUD Tests for All Schemas (With Manager Login)', () => {
  orderedSchemas.forEach((endpoint) => {
    test(`List ${endpoint}`, async () => {
      await listRequest(endpoint);
    });
  });

  orderedSchemas.forEach((endpoint) => {
    test(`Create ${endpoint}`, async () => {
      if (!schemas[endpoint]) {
        throw new Error(`Schema for ${endpoint} is missing.`);
      }
      const createObject = generateObjectFromSchema(endpoint, schemas[endpoint]);
      await postRequest(endpoint, createObject);
    });
  });

  orderedSchemas.forEach((endpoint) => {
    test(`Read ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}.`);
      }
      await getRequest(endpoint, createdIds[endpoint]);
    });
  });

  orderedSchemas.forEach((endpoint) => {
    test(`Update ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}.`);
      }
      let updateObject;
      if (endpoint === 'assets' || endpoint === 'apartments') {
        updateObject = getUpdateObject(endpoint, schemas[endpoint]);
      } else {
        updateObject = generateObjectFromSchema(endpoint, schemas[endpoint]);
      }
      await putRequest(endpoint, createdIds[endpoint], updateObject);
    });
  });

  orderedSchemas.reverse().forEach((endpoint) => {
    test(`Delete ${endpoint}`, async () => {
      if (!createdIds[endpoint]) {
        throw new Error(`No ID found for ${endpoint}.`);
      }
      await deleteRequest(endpoint, createdIds[endpoint]);
    });
  });
});
