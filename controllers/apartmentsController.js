const pool = require('../database'); // Import MySQL connection

// Get all apartments
exports.getAllApartments = async (req, res) => {
  try {
    console.log("✅ Fetching all apartments...");
    const [rows] = await pool.query("SELECT * FROM apartments");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching apartments:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single apartment by ID
exports.getApartmentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM apartments WHERE apartment_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Apartment not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching apartment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new apartment
exports.createApartment = async (req, res) => {
  try {
    const { property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount } = req.body;
    const [result] = await pool.query(
      "INSERT INTO apartments (property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount]
    );
    res.status(201).json({ message: "Apartment created successfully", apartment_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating apartment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update an apartment by ID
exports.updateApartment = async (req, res) => {
  try {
    const { property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount } = req.body;
    const [result] = await pool.query(
      "UPDATE apartments SET property_id = ?, unit_number = ?, floor = ?, bedrooms = ?, bathrooms = ?, square_footage = ?, rent_amount = ? WHERE apartment_id = ?",
      [property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Apartment not found" });

    res.json({ message: "Apartment updated successfully" });
  } catch (error) {
    console.error("❌ Error updating apartment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete an apartment by ID
exports.deleteApartment = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM apartments WHERE apartment_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Apartment not found" });

    res.json({ message: "Apartment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting apartment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
