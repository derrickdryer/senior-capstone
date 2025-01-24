const pool = require('../database'); // Import MySQL connection

// Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    console.log("✅ Fetching all tenants...");
    const [rows] = await pool.query("SELECT * FROM tenants");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching tenants:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tenants WHERE tenant_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Tenant not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching tenant:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new tenant
exports.createTenant = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;
    const [result] = await pool.query(
      "INSERT INTO tenants (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, phone_number]
    );
    res.status(201).json({ message: "Tenant created successfully", tenant_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating tenant:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a tenant by ID
exports.updateTenant = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;
    const [result] = await pool.query(
      "UPDATE tenants SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE tenant_id = ?",
      [first_name, last_name, email, phone_number, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });

    res.json({ message: "Tenant updated successfully" });
  } catch (error) {
    console.error("❌ Error updating tenant:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a tenant by ID
exports.deleteTenant = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tenants WHERE tenant_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });

    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting tenant:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
