import { pool } from './db.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await pool.query(schema);
        console.log('Schema applied successfully.');

        // Seed initial admin user if not exists
        const adminCheck = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
        if (adminCheck.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword]);
            console.log('Default admin user created (username: admin, password: admin123)');
        }

        // Seed initial content if tables are empty
        // Services
        const servicesCheck = await pool.query('SELECT COUNT(*) FROM services');
        if (parseInt(servicesCheck.rows[0].count) === 0) {
            const services = [
                ['Web Development', 'Scalable, high-performance web applications built with modern stacks.', 'code'],
                ['Frontend Engineering', 'Interactive, smooth, and responsive interfaces using React & GSAP.', 'layout'],
                ['UI/UX Design', 'User-centric design systems that convert visitors into customers.', 'pen-tool'],
                ['Branding', 'Complete identity systems from logos to brand guidelines.', 'star']
            ];
            for (const service of services) {
                await pool.query('INSERT INTO services (title, description, icon) VALUES ($1, $2, $3)', service);
            }
            console.log('Seeded services.');
        }

        // Portfolio
        const portfolioCheck = await pool.query('SELECT COUNT(*) FROM portfolio');
        if (parseInt(portfolioCheck.rows[0].count) === 0) {
            const portfolios = [
                ['FinTech Dashboard', 'Web App', 'https://picsum.photos/800/600?random=1', 'Real-time financial data visualization.'],
                ['Neon Commerce', 'E-Commerce', 'https://picsum.photos/800/600?random=2', 'High-conversion streetwear store.'],
                ['Future Health', 'Mobile App', 'https://picsum.photos/800/600?random=3', 'Telemedicine platform for the future.']
            ];
            for (const item of portfolios) {
                await pool.query('INSERT INTO portfolio (title, category, image, description) VALUES ($1, $2, $3, $4)', item);
            }
            console.log('Seeded portfolio.');
        }

        // Testimonials
        const testimonialsCheck = await pool.query('SELECT COUNT(*) FROM testimonials');
        if (parseInt(testimonialsCheck.rows[0].count) === 0) {
            const testimonials = [
                ['Sarah Jenkins', 'CEO, TechFlow', 'Gradevo transformed our digital presence. The 3D integration is seamless.'],
                ['Marcus Chen', 'Founder, StartUp X', 'Pixel-perfect design and incredibly fast delivery. Highly recommended.']
            ];
            for (const item of testimonials) {
                await pool.query('INSERT INTO testimonials (name, role, content) VALUES ($1, $2, $3)', item);
            }
            console.log('Seeded testimonials.');
        }

        // Site Content
        const contentCheck = await pool.query('SELECT COUNT(*) FROM site_content');
        if (parseInt(contentCheck.rows[0].count) === 0) {
            const content = [
                ['heroTitle', 'Gra#Devo — Design. Develop. Deploy.'],
                ['heroSubtitle', 'A full-stack creative agency blending design, engineering, and storytelling to help brands grow digitally.'],
                ['servicesIntro', 'We build digital experiences that are fast, beautiful, and ready to scale.'],
                ['contactCTA', 'Let’s build something extraordinary.']
            ];
            for (const item of content) {
                await pool.query('INSERT INTO site_content (key, value) VALUES ($1, $2)', item);
            }
            console.log('Seeded site content.');
        }

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
