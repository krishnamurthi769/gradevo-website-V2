import { pool } from './db.js';

const addIsFeaturedColumn = async () => {
    try {
        await pool.query(`
      ALTER TABLE portfolio 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    `);
        console.log('Added is_featured column to portfolio table');
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

addIsFeaturedColumn();
