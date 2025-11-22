import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const updateSchema = async () => {
    try {
        console.log('Updating database schema...');

        // Add columns to portfolio table
        await pool.query(`
      ALTER TABLE portfolio 
      ADD COLUMN IF NOT EXISTS project_url TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack TEXT;
    `);
        console.log('Updated portfolio table.');

        // Add columns to testimonials table
        await pool.query(`
      ALTER TABLE testimonials 
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
    `);
        console.log('Updated testimonials table.');

        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        await pool.end();
    }
};

updateSchema();
