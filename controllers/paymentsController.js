const pool = require('../database'); // Import MySQL connection

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    console.log("✅ Fetching all payments...");
    const [rows] = await pool.query("SELECT * FROM payments");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payments WHERE payment_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Payment not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching payment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { lease_id, payment_date, amount, payment_method, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO payments (lease_id, payment_date, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)",
      [lease_id, payment_date, amount, payment_method, status]
    );
    res.status(201).json({ message: "Payment created successfully", payment_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const { lease_id, payment_date, amount, payment_method, status } = req.body;
    const [result] = await pool.query(
      "UPDATE payments SET lease_id = ?, payment_date = ?, amount = ?, payment_method = ?, status = ? WHERE payment_id = ?",
      [lease_id, payment_date, amount, payment_method, status, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM payments WHERE payment_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting payment:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
