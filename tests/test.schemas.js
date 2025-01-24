// tests/test.schemas.js

const testData = {
    assets: () => ({
      name: `Asset-${Date.now()}`,
      location: "123 Test St, Test City",
      value: 500000,
    }),
    users: () => ({
      username: `user-${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: "securepassword",
    }),
    apartments: (asset_id) => ({
      asset_id,
      unit: `A-${Math.floor(Math.random() * 100)}`,
      rent: 1200,
      bedrooms: 2,
      bathrooms: 1,
    }),
    tenants: (apartment_id) => ({
      name: "John Doe",
      email: `tenant${Date.now()}@example.com`,
      phone: "555-1234",
      apartment_id,
    }),
    leases: (tenant_id, apartment_id) => ({
      tenant_id,
      apartment_id,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      rent_amount: 1200,
    }),
    payments: (lease_id) => ({
      lease_id,
      amount: 1200,
      date: new Date().toISOString().split("T")[0],
    }),
    maintenance_requests: (tenant_id, apartment_id) => ({
      tenant_id,
      apartment_id,
      description: "Leaky faucet",
      status: "pending",
    }),
    notifications: (user_id) => ({
      user_id,
      message: "New rent due",
    }),
    inquiries: (tenant_id, asset_id, apartment_id) => ({
      tenant_id,
      asset_id,
      apartment_id,
      message: "Interested in renting this unit",
    }),
  };
  
  module.exports = testData;
  