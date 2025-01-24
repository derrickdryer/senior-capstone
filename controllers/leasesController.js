const pool = require('../database'); // Import MySQL connection

// Get all leases
exports.getAllLeases = async (req, res) => {
  try {
    console.log("✅ Fetching all leases...");
    const [rows] = await pool.query("SELECT * FROM leases");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching leases:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single lease by ID
exports.getLeaseById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM leases WHERE lease_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Lease not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching lease:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new lease
exports.createLease = async (req, res) => {
  try {
    const { tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO leases (tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status]
    );
    res.status(201).json({ message: "Lease created successfully", lease_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating lease:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a lease by ID
exports.updateLease = async (req, res) => {
  try {
    const { tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status } = req.body;
    const [result] = await pool.query(
      "UPDATE leases SET tenant_id = ?, apartment_id = ?, lease_start_date = ?, lease_end_date = ?, monthly_rent = ?, security_deposit = ?, status = ? WHERE lease_id = ?",
      [tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Lease not found" });

    res.json({ message: "Lease updated successfully" });
  } catch (error) {
    console.error("❌ Error updating lease:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a lease by ID
exports.deleteLease = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM leases WHERE lease_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Lease not found" });

    res.json({ message: "Lease deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting lease:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
