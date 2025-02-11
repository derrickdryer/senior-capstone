const pool = require('../database'); // Import MySQL connection

// Get all leases
exports.getAllLeases = async (ctx) => {
    try {
        console.log("✅ Fetching all leases...");
        const [rows] = await pool.query("SELECT * FROM leases");
        ctx.status = 200;
        ctx.body = rows;
    } catch (error) {
        console.error("❌ Error fetching leases:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Get a single lease by ID
exports.getLeaseById = async (ctx) => {
    try {
        const [rows] = await pool.query("SELECT * FROM leases WHERE lease_id = ?", [ctx.params.id]);
        if (rows.length === 0) {
            ctx.status = 404;
            ctx.body = { error: "Lease not found" };
            return;
        }
        ctx.status = 200;
        ctx.body = rows[0];
    } catch (error) {
        console.error("❌ Error fetching lease:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Create a new lease
exports.createLease = async (ctx) => {
    try {
        const { tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status } = ctx.request.body;
        const [result] = await pool.query(
            "INSERT INTO leases (tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status]
        );
        ctx.status = 201;
        ctx.body = { message: "Lease created successfully", lease_id: result.insertId };
    } catch (error) {
        console.error("❌ Error creating lease:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Update a lease by ID
exports.updateLease = async (ctx) => {
    try {
        const { tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status } = ctx.request.body;
        const [result] = await pool.query(
            "UPDATE leases SET tenant_id = ?, apartment_id = ?, lease_start_date = ?, lease_end_date = ?, monthly_rent = ?, security_deposit = ?, status = ? WHERE lease_id = ?",
            [tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status, ctx.params.id]
        );

        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Lease not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Lease updated successfully" };
    } catch (error) {
        console.error("❌ Error updating lease:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Delete a lease by ID
exports.deleteLease = async (ctx) => {
    try {
        const [result] = await pool.query("DELETE FROM leases WHERE lease_id = ?", [ctx.params.id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Lease not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Lease deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting lease:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};