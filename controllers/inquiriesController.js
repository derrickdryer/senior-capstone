const pool = require('../database'); // Import MySQL connection

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    console.log("✅ Fetching all inquiries...");
    const [rows] = await pool.query("SELECT * FROM inquiries");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching inquiries:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inquiries WHERE inquiry_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Inquiry not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching inquiry:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { tenant_id, property_id, apartment_id, inquiry_content, response_date, first_name, last_name, phone_number } = req.body;
    const [result] = await pool.query(
      "INSERT INTO inquiries (tenant_id, property_id, apartment_id, inquiry_content, response_date, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [tenant_id, property_id, apartment_id, inquiry_content, response_date, first_name, last_name, phone_number]
    );
    res.status(201).json({ message: "Inquiry created successfully", inquiry_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update an inquiry by ID
exports.updateInquiry = async (req, res) => {
  try {
    const { tenant_id, property_id, apartment_id, inquiry_content, response_date, first_name, last_name, phone_number } = req.body;
    const [result] = await pool.query(
      "UPDATE inquiries SET tenant_id = ?, property_id = ?, apartment_id = ?, inquiry_content = ?, response_date = ?, first_name = ?, last_name = ?, phone_number = ? WHERE inquiry_id = ?",
      [tenant_id, property_id, apartment_id, inquiry_content, response_date, first_name, last_name, phone_number, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Inquiry not found" });

    res.json({ message: "Inquiry updated successfully" });
  } catch (error) {
    console.error("❌ Error updating inquiry:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete an inquiry by ID
exports.deleteInquiry = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM inquiries WHERE inquiry_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Inquiry not found" });

    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting inquiry:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
