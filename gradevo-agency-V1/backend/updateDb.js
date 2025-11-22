import { pool } from './db.js';

const createDnaTable = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS dna (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
      );
    `);
        console.log('DNA table created');

        // Seed data
        const dnaData = [
            {
                title: 'Immersive #Experiences',
                description: 'We transform passive viewing into active participation. Our digital worlds are designed to captivate, engage, and leave a lasting impression.',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Pixel #Perfection',
                description: 'Quality is non-negotiable. We obsess over every micro-interaction, ensuring smooth animations and flawless execution across all devices.',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Strategic #Growth',
                description: 'Beauty with purpose. We blend aesthetic excellence with data-driven strategy to ensure your digital presence drives real business results.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Future #Ready',
                description: 'We build on modern stacks designed for scale. From Web3 to AI integration, we prepare your brand for the digital landscape of tomorrow.',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000'
            }
        ];

        for (const item of dnaData) {
            await pool.query(
                'INSERT INTO dna (title, description, image) VALUES ($1, $2, $3)',
                [item.title, item.description, item.image]
            );
        }
        console.log('DNA data seeded');

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

createDnaTable();
