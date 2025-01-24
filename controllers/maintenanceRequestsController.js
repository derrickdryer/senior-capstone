const pool = require('../database'); // Import MySQL connection

// Get all maintenance requests
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    console.log("✅ Fetching all maintenance requests...");
    const [rows] = await pool.query("SELECT * FROM maintenance_requests");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching maintenance requests:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single maintenance request by ID
exports.getMaintenanceRequestById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM maintenance_requests WHERE request_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Maintenance request not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching maintenance request:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new maintenance request
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to } = req.body;
    const [result] = await pool.query(
      "INSERT INTO maintenance_requests (tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to]
    );
    res.status(201).json({ message: "Maintenance request created successfully", request_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating maintenance request:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a maintenance request by ID
exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const { tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to } = req.body;
    const [result] = await pool.query(
      "UPDATE maintenance_requests SET tenant_id = ?, apartment_id = ?, request_date = ?, issue_description = ?, status = ?, completion_date = ?, assigned_to = ? WHERE request_id = ?",
      [tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Maintenance request not found" });

    res.json({ message: "Maintenance request updated successfully" });
  } catch (error) {
    console.error("❌ Error updating maintenance request:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a maintenance request by ID
exports.deleteMaintenanceRequest = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM maintenance_requests WHERE request_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Maintenance request not found" });

    res.json({ message: "Maintenance request deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting maintenance request:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
