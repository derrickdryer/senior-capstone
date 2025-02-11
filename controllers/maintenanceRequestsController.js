const pool = require('../database'); // Import MySQL connection

// Get all maintenance requests
exports.getAllMaintenanceRequests = async (ctx) => {
    try {
        console.log("✅ Fetching all maintenance requests...");
        const [rows] = await pool.query("SELECT * FROM maintenance_requests");
        ctx.status = 200;
        ctx.body = rows;
    } catch (error) {
        console.error("❌ Error fetching maintenance requests:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Get a single maintenance request by ID
exports.getMaintenanceRequestById = async (ctx) => {
    try {
        const [rows] = await pool.query("SELECT * FROM maintenance_requests WHERE request_id = ?", [ctx.params.id]);
        if (rows.length === 0) {
            ctx.status = 404;
            ctx.body = { error: "Maintenance request not found" };
            return;
        }
        ctx.status = 200;
        ctx.body = rows[0];
    } catch (error) {
        console.error("❌ Error fetching maintenance request:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Create a new maintenance request
exports.createMaintenanceRequest = async (ctx) => {
    try {
        const { tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to } = ctx.request.body;
        const [result] = await pool.query(
            "INSERT INTO maintenance_requests (tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to]
        );
        ctx.status = 201;
        ctx.body = { message: "Maintenance request created successfully", request_id: result.insertId };
    } catch (error) {
        console.error("❌ Error creating maintenance request:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Update a maintenance request by ID
exports.updateMaintenanceRequest = async (ctx) => {
    try {
        const { tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to } = ctx.request.body;
        const [result] = await pool.query(
            "UPDATE maintenance_requests SET tenant_id = ?, apartment_id = ?, request_date = ?, issue_description = ?, status = ?, completion_date = ?, assigned_to = ? WHERE request_id = ?",
            [tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to, ctx.params.id]
        );

        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Maintenance request not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Maintenance request updated successfully" };
    } catch (error) {
        console.error("❌ Error updating maintenance request:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};

// Delete a maintenance request by ID
exports.deleteMaintenanceRequest = async (ctx) => {
    try {
        const [result] = await pool.query("DELETE FROM maintenance_requests WHERE request_id = ?", [ctx.params.id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { error: "Maintenance request not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = { message: "Maintenance request deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting maintenance request:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error", message: error.message };
    }
};