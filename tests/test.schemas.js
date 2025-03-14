// ======================================================================
// File: test.schemas.js
// Description: Provides factory functions that generate test data schemas for
//              assets, users, apartments, tenants, leases, payments,
//              maintenance requests, notifications, and inquiries.
// Usage: Import these functions in tests to create test data on the fly.
// ======================================================================

const testData = {
  // Returns a test asset with a unique name and fixed location and value.
  assets: () => ({
    name: `Asset-${Date.now()}`,
    location: '123 Test St, Test City',
    value: 500000,
  }),
  // Returns a test user with a unique username and email, and a fixed password.
  users: () => ({
    username: `user-${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'securepassword',
  }),
  // Returns a test apartment linked to the provided asset_id with random unit number.
  apartments: (asset_id) => ({
    asset_id,
    unit: `A-${Math.floor(Math.random() * 100)}`,
    rent: 1200,
    bedrooms: 2,
    bathrooms: 1,
  }),
  // Returns a test tenant with a unique email and fixed contact details for the specified apartment.
  tenants: (apartment_id) => ({
    name: 'John Doe',
    email: `tenant${Date.now()}@example.com`,
    phone: '555-1234',
    apartment_id,
  }),
  // Returns a test lease linking a tenant and an apartment with start and end dates set for one year.
  leases: (tenant_id, apartment_id) => ({
    tenant_id,
    apartment_id,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rent_amount: 1200,
  }),
  // Returns a test payment for the specified lease with the current date.
  payments: (lease_id) => ({
    lease_id,
    amount: 1200,
    date: new Date().toISOString().split('T')[0],
  }),
  // Returns a test maintenance request for the specified tenant and apartment.
  maintenance_requests: (tenant_id, apartment_id) => ({
    tenant_id,
    apartment_id,
    description: 'Leaky faucet',
    status: 'pending',
  }),
  // Returns a test notification for the specified user.
  notifications: (user_id) => ({
    user_id,
    message: 'New rent due',
  }),
  // Returns a test inquiry linking a tenant, asset, and apartment with a message.
  inquiries: (tenant_id, asset_id, apartment_id) => ({
    tenant_id,
    asset_id,
    apartment_id,
    message: 'Interested in renting this unit',
  }),
};

module.exports = testData;
