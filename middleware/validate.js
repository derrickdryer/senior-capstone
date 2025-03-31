const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('manager', 'maintenance', 'tenant').required(),
  // ...other fields...
});

const registerUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('tenant').required(),
  // ...other fields...
});

const updateUserSchema = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('manager', 'maintenance', 'tenant').optional(),
  // ...other fields...
});

const createAssetSchema = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required(),
  num_apartments: Joi.number().integer().required(),
  is_available: Joi.boolean().optional(),
});

const updateAssetSchema = Joi.object({
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  num_apartments: Joi.number().integer().optional(),
  is_available: Joi.boolean().optional(),
});

const createApartmentSchema = Joi.object({
  property_id: Joi.number().integer().required(),
  unit_number: Joi.string().required(),
  floor: Joi.number().integer().required(),
  bedrooms: Joi.number().required(),
  bathrooms: Joi.number().required(),
  square_footage: Joi.number().required(),
  rent_amount: Joi.number().required(),
  is_available: Joi.boolean().optional(),
});

const updateApartmentSchema = Joi.object({
  property_id: Joi.number().integer().optional(),
  unit_number: Joi.string().optional(),
  floor: Joi.number().integer().optional(),
  bedrooms: Joi.number().optional(),
  bathrooms: Joi.number().optional(),
  square_footage: Joi.number().optional(),
  rent_amount: Joi.number().optional(),
  is_available: Joi.boolean().optional(),
});

const createMaintenanceRequestSchema = Joi.object({
  tenant_id: Joi.number().integer().required(),
  apartment_id: Joi.number().integer().required(),
  request_date: Joi.date().required(),
  issue_description: Joi.string().required(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').required(),
  completion_date: Joi.date().optional().allow(null),
  assigned_to: Joi.string().optional().allow(null),
});

const updateMaintenanceRequestSchema = Joi.object({
  tenant_id: Joi.number().integer().optional(),
  apartment_id: Joi.number().integer().optional(),
  request_date: Joi.date().optional(),
  issue_description: Joi.string().optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').optional(),
  completion_date: Joi.date().optional().allow(null),
  assigned_to: Joi.string().optional().allow(null),
});

const createPaymentSchema = Joi.object({
  lease_id: Joi.number().integer().required(),
  payment_date: Joi.date().required(),
  amount: Joi.number().required(),
  payment_method: Joi.string()
    .valid('credit_card', 'bank_transfer', 'check')
    .required(),
  status: Joi.string().valid('completed', 'pending', 'failed').required(),
});

const updatePaymentSchema = Joi.object({
  lease_id: Joi.number().integer().optional(),
  payment_date: Joi.date().optional(),
  amount: Joi.number().optional(),
  payment_method: Joi.string()
    .valid('credit_card', 'bank_transfer', 'check')
    .optional(),
  status: Joi.string().valid('completed', 'pending', 'failed').optional(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// New image schemas
const createImageSchema = Joi.object({
  property_id: Joi.number().integer().required(),
  apartment_id: Joi.number().integer().optional().allow(null),
  image_url: Joi.alternatives()
    .try(Joi.string().uri(), Joi.array().items(Joi.string().uri()))
    .required(),
  caption: Joi.string().optional(),
});

const updateImageSchema = Joi.object({
  property_id: Joi.number().integer().optional(),
  apartment_id: Joi.number().integer().optional().allow(null),
  image_url: Joi.alternatives()
    .try(Joi.string().uri(), Joi.array().items(Joi.string().uri()))
    .optional(),
  caption: Joi.string().optional(),
});

// New lease schemas
const createLeaseSchema = Joi.object({
  tenant_id: Joi.number().integer().required(),
  apartment_id: Joi.number().integer().required(),
  lease_start_date: Joi.date().required(),
  lease_end_date: Joi.date().required(),
  monthly_rent: Joi.number().required(),
  security_deposit: Joi.number().required(),
  status: Joi.string().valid('active', 'terminated', 'pending').required(),
});

const updateLeaseSchema = Joi.object({
  tenant_id: Joi.number().integer().optional(),
  apartment_id: Joi.number().integer().optional(),
  lease_start_date: Joi.date().optional(),
  lease_end_date: Joi.date().optional(),
  monthly_rent: Joi.number().optional(),
  security_deposit: Joi.number().optional(),
  status: Joi.string().valid('active', 'terminated', 'pending').optional(),
});

// New tenant schemas
const createTenantSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  user_id: Joi.number().integer().optional(),
});

const updateTenantSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone_number: Joi.string().optional(),
  user_id: Joi.number().integer().optional(),
});

function validateBody(schema) {
  return async (ctx, next) => {
    const { error, value } = schema.validate(ctx.request.body, {
      abortEarly: false,
    });
    if (error) {
      ctx.status = 400;
      ctx.body = { errors: error.details.map((err) => err.message) };
      return;
    }
    ctx.request.body = value;
    await next();
  };
}

module.exports = {
  validateCreateUser: validateBody(createUserSchema),
  validateUpdateUser: validateBody(updateUserSchema),
  validateRegisterUser: validateBody(registerUserSchema),
  validateCreateAsset: validateBody(createAssetSchema),
  validateUpdateAsset: validateBody(updateAssetSchema),
  validateCreateApartment: validateBody(createApartmentSchema),
  validateUpdateApartment: validateBody(updateApartmentSchema),
  validateCreateMaintenanceRequest: validateBody(
    createMaintenanceRequestSchema
  ),
  validateUpdateMaintenanceRequest: validateBody(
    updateMaintenanceRequestSchema
  ),
  validateCreatePayment: validateBody(createPaymentSchema),
  validateUpdatePayment: validateBody(updatePaymentSchema),
  validateLogin: validateBody(loginSchema),
  // New exports for images
  validateCreateImage: validateBody(createImageSchema),
  validateUpdateImage: validateBody(updateImageSchema),
  // New exports for leases
  validateCreateLease: validateBody(createLeaseSchema),
  validateUpdateLease: validateBody(updateLeaseSchema),
  // New exports for tenants
  validateCreateTenant: validateBody(createTenantSchema),
  validateUpdateTenant: validateBody(updateTenantSchema),
};
