const pool = require('../database'); // Import MySQL connection

// Get all inquiries
exports.getAllInquiries = async (ctx) => {
    try {
        const [rows] = await pool.query("SELECT * FROM inquiries");
        ctx.status = 200;
        ctx.body = rows;
    } catch (error) {
        console.error("❌ Error fetching inquiries:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Get a single inquiry by ID
exports.getInquiryById = async (ctx) => {
    try {
        const [rows] = await pool.query("SELECT * FROM inquiries WHERE inquiry_id = ?", [ctx.params.id]);
        if (rows.length === 0) {
            ctx.status = 404;
            ctx.body = { error: "Inquiry not found" };
            return;
        }
        ctx.status = 200;
        ctx.body = rows[0];
    } catch (error) {
        console.error("❌ Error fetching inquiry:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Create a new inquiry
exports.createInquiry = async (ctx) => {
    try {
        const { tenant_id, apartment_id, inquiry_date, message } = ctx.request.body;
        const [result] = await pool.query(
            "INSERT INTO inquiries (tenant_id, apartment_id, inquiry_date, message) VALUES (?, ?, ?, ?)",
            [tenant_id, apartment_id, inquiry_date, message]
        );
        ctx.status = 201;
        ctx.body = { message: "Inquiry created successfully", inquiry_id: result.insertId };
    } catch (error) {
        console.error("❌ Error creating inquiry:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Update an inquiry by ID
exports.updateInquiry = async (ctx) => {
    try {
        const { tenant_id, apartment_id, inquiry_date, message } = ctx.request.body;
        const [result] = await pool.query(
            "UPDATE inquiries SET tenant_id = ?, apartment_id = ?, inquiry_date = ?, message = ? WHERE inquiry_id = ?",
            [tenant_id, apartment_id, inquiry_date, message, ctx.params.id]
        );

        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Inquiry not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Inquiry updated successfully" };
    } catch (error) {
        console.error("❌ Error updating inquiry:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Delete an inquiry by ID
exports.deleteInquiry = async (ctx) => {
    try {
        const [result] = await pool.query("DELETE FROM inquiries WHERE inquiry_id = ?", [ctx.params.id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Inquiry not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Inquiry deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting inquiry:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};