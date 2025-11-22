import { pool } from './db.js';

async function migrateCategories() {
    try {
        await pool.query("UPDATE portfolio SET category = 'Brand Solutions' WHERE category = 'Brand'");
        await pool.query("UPDATE portfolio SET category = 'Brand Solutions' WHERE category = 'Graphic Design'");
        await pool.query("UPDATE portfolio SET category = 'Tech Solutions' WHERE category = 'Web Development'");
        await pool.query("UPDATE portfolio SET category = 'Tech Solutions' WHERE category = 'Mobile App'");
        await pool.query("UPDATE portfolio SET category = 'Tech Solutions' WHERE category = 'E-Commerce'");
        console.log('Migration complete');
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

migrateCategories();
