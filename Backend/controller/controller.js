// controller.js

import { pool } from "../config/connection.js";
// Get all appointments
export const getAppointments = async (req, res) => {
    const { id, customerName, providerName, service } = req.query;
    try {
        let query = 'SELECT * FROM appointments';
        const conditions = [];
        const values = [];

        if (id) {
            conditions.push(`id = $${conditions.length + 1}`);
            values.push(id);
        }
        if (customerName) {
            conditions.push(`customerName ILIKE $${conditions.length + 1}`);
            values.push(`%${customerName}%`);
        }
        if (providerName) {
            conditions.push(`providerName ILIKE $${conditions.length + 1}`);
            values.push(`%${providerName}%`);
        }
        if (service) {
            conditions.push(`service ILIKE $${conditions.length + 1}`);
            values.push(`%${service}%`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ' ORDER BY created_at DESC'; // Order by creation date descending

        const results = await pool.query(query, values);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching appointments:', error.message);
        res.status(500).json({ error: error.message });
    }
};
// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM appointments WHERE id = $1';
        const results = await pool.query(query, [id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching appointment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
    const { customerName, providerName, service, date, time, status } = req.body;
    try {
        const query = `
            INSERT INTO appointments (customerName, providerName, service, date, time, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`;
        const values = [customerName, providerName, service, date, time, status];
        const results = await pool.query(query, values);

        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error creating appointment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { customerName, providerName, service, date, time, status } = req.body;

    if (!customerName || !providerName || !service || !date || !time || !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
            UPDATE appointments
            SET customerName = $1, providerName = $2, service = $3, date = $4, time = $5, status = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7 RETURNING *;
        `;
        const values = [customerName, providerName, service, date, time, status, id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating appointment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *';
        const results = await pool.query(query, [id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error.message);
        res.status(500).json({ error: error.message });
    }
};