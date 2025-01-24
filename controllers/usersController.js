const pool = require('../database');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { property_id, role, username, password, phone_number, mfa_secret } = req.body;
    const result = await pool.query(
      "INSERT INTO users (property_id, role, username, password, phone_number, mfa_secret) VALUES (?, ?, ?, ?, ?, ?)",
      [property_id, role, username, password, phone_number, mfa_secret]
    );
    res.status(201).json({ message: "User created successfully", user_id: result[0].insertId });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { property_id, role, username, password, phone_number, mfa_secret } = req.body;
    await pool.query(
      "UPDATE users SET property_id = ?, role = ?, username = ?, password = ?, phone_number = ?, mfa_secret = ? WHERE user_id = ?",
      [property_id, role, username, password, phone_number, mfa_secret, req.params.id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE user_id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
