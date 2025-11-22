import { pool } from './db.js';

async function fetchItems() {
    try {
        const res = await pool.query('SELECT id, title, category FROM portfolio');
        console.log('Items:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

fetchItems();
