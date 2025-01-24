const pool = require('../database'); // Import MySQL connection

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    console.log("✅ Fetching all assets...");
    const [rows] = await pool.query("SELECT * FROM assets");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM assets WHERE property_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Asset not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching asset:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new asset
exports.createAsset = async (req, res) => {
  try {
    const { address, city, state, postal_code, num_apartments } = req.body;
    const [result] = await pool.query(
      "INSERT INTO assets (address, city, state, postal_code, num_apartments) VALUES (?, ?, ?, ?, ?)",
      [address, city, state, postal_code, num_apartments]
    );
    res.status(201).json({ message: "Asset created successfully", property_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating asset:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update an asset by ID
exports.updateAsset = async (req, res) => {
  try {
    const { address, city, state, postal_code, num_apartments } = req.body;
    const [result] = await pool.query(
      "UPDATE assets SET address = ?, city = ?, state = ?, postal_code = ?, num_apartments = ? WHERE property_id = ?",
      [address, city, state, postal_code, num_apartments, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Asset not found" });

    res.json({ message: "Asset updated successfully" });
  } catch (error) {
    console.error("❌ Error updating asset:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete an asset by ID
exports.deleteAsset = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM assets WHERE property_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Asset not found" });

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting asset:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
