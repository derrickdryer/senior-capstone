const config = require('../configs.json');
const { endpoints } = require('./crud.test');
const request = require('supertest');

const host = config.database.host;
const port = config.database.port;
const baseUrl = `http://${host}:${port}/rest`;

const schemas = {}; // Removed TypeScript type annotations
const createdIds = {};


test("Ping API Server", async () => {
    try {
      const response = await request(baseUrl).get("/ping");
      expect(response.status).toBe(200);
      console.log("✅ Server is running!");
    } catch (error) {
      console.error("❌ Server is NOT running. Please start the API server.");
      throw error;
    }
  });


const defaultValues = {
  string: `test-${Date.now()}`,
  number: 123334,
  boolean: true,
  object: { test: 'test' },
  array: ['test'],
  date: new Date().toISOString(),
};

const fetchEndpointSchema = async (endpoint) => {
  const response = await request(baseUrl).get(`/${endpoint}`).expect(200);
  const data = response.body.data || response.body;
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error(`No data returned from ${endpoint}`);
  }
  const schema = {};
  const target = Array.isArray(data) ? data[0] : data;

  Object.keys(target).forEach((key) => {
    const value = target[key];
    schema[key] = {
      type: typeof value,
      required: key !== 'id' && key !== 'created_at' && key !== 'updated_at',
    };
  });
  return schema;
};

const generateObjectFromSchema = (schema) => {
  const obj = {};
  Object.keys(schema).forEach((field) => {
    const { type, required } = schema[field];
    if (required) {
      obj[field] = defaultValues[type] || 'test';
    }
  });
  return obj;
};

// Function to make POST requests
const postRequest = async (endpoint, data) => {
  const response = await request(baseUrl)
    .post(`/${endpoint}`)
    .send(data)
    .expect('Content-Type', /json/)
    .expect(201);

  return response.body.data || response.body;
};

// Function to make GET requests
const getRequest = async (endpoint, id) => {
  const response = await request(baseUrl)
    .get(`/${endpoint}/${id}`)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body.data || response.body;
};

// Function to make PUT requests
const putRequest = async (endpoint, id, data) => {
  const response = await request(baseUrl)
    .put(`/${endpoint}/${id}`)
    .send(data)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body.data || response.body;
};

// Function to make DELETE requests
const deleteRequest = async (endpoint, id) => {
  await request(baseUrl).delete(`/${endpoint}/${id}`).expect(200);
};

// Function to make LIST requests
const listRequest = async (endpoint) => {
  const response = await request(baseUrl)
    .get(`/${endpoint}`)
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body.data || response.body;
};

// Field validation function
const validateFields = (actual, expected) => {
  Object.keys(expected).forEach((key) => {
    const { required, type } = expected[key];

    if (required) {
      expect(actual).toHaveProperty(key);
    }

    if (type && actual[key] !== undefined) {
      expect(typeof actual[key]).toBe(type);
    }
  });
};

// Test Suite
describe('Create Read Update Tests for All Endpoints', () => {
  beforeAll(async () => {
    await Promise.all(
      endpoints.map(async (endpoint) => {
        schemas[endpoint] = await fetchEndpointSchema(endpoint);
      })
    );
  });

  endpoints.forEach((endpoint) => {
    test(`List ${endpoint}`, async () => {
      const list = await listRequest(endpoint);
      expect(list).toBeInstanceOf(Array);
    });
  });

  endpoints.forEach((endpoint) => {
    test(`Create ${endpoint}`, async () => {
      let createObject = generateObjectFromSchema(schemas[endpoint]);

      const created = await postRequest(endpoint, createObject);
      createdIds[endpoint] = created.id || created[`${endpoint.slice(0, -1)}_id`];
      validateFields(created, createObject);
    });
  });

  endpoints.forEach((endpoint) => {
    test(`Read ${endpoint}`, async () => {
      const retrieved = await getRequest(endpoint, createdIds[endpoint]);
      validateFields(retrieved, schemas[endpoint]);
    });
  });

  endpoints.forEach((endpoint) => {
    test(`Update ${endpoint}`, async () => {
      let updateObject = generateObjectFromSchema(schemas[endpoint]);

      const updated = await putRequest(endpoint, createdIds[endpoint], updateObject);
      validateFields(updated, updateObject);
    });
  });

  endpoints.forEach((endpoint) => {
    test(`Pagination for ${endpoint}`, async () => {
      const page1 = await listRequest(`${endpoint}?size=2&page=1`);
      const page2 = await listRequest(`${endpoint}?size=2&page=2`);
      expect(page1).toBeInstanceOf(Array);
      expect(page1.length).toBeLessThanOrEqual(2);
      expect(page2).toBeInstanceOf(Array);
      expect(page2.length).toBeLessThanOrEqual(2);
    });
  });

  endpoints.forEach((endpoint) => {
    test(`Search for ${endpoint}`, async () => {
      const searchResults = await listRequest(`${endpoint}?search=boingo.com`);
      expect(searchResults).toBeInstanceOf(Array);
      if (searchResults.length > 0) {
        expect(Object.keys(searchResults[0])).toContain('id');
      }
    });
  });

  endpoints.reverse().forEach((endpoint) => {
    test(`Delete ${endpoint}`, async () => {
      await deleteRequest(endpoint, createdIds[endpoint]);
    });
  });
});
