import { pool } from './db.js';

async function checkCategories() {
    try {
        const res = await pool.query('SELECT DISTINCT category FROM portfolio');
        console.log('Categories:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkCategories();
