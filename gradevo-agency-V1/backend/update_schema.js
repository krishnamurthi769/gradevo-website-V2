import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateSchema = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema updates...');
        await pool.query(schemaSql);

        // Manually add status column if it doesn't exist (since CREATE TABLE skips if exists)
        try {
            await pool.query(`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new'`);
            console.log('Added status column to contact_submissions');
        } catch (e) {
            console.log('Status column might already exist or error:', e.message);
        }

        console.log('Schema updated successfully!');
    } catch (err) {
        console.error('Failed to update schema:', err);
    } finally {
        await pool.end();
    }
};

updateSchema();
