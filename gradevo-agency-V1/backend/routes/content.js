import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();

// Configure Multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/services', authenticateToken, async (req, res) => {
    const { title, description, icon } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO services (title, description, icon) VALUES ($1, $2, $3) RETURNING *',
            [title, description, icon]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/services/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, icon } = req.body;
    try {
        const result = await pool.query(
            'UPDATE services SET title = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *',
            [title, description, icon, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/services/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM services WHERE id = $1', [id]);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// --- PORTFOLIO ---
router.get('/portfolio', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM portfolio ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/portfolio', authenticateToken, upload.single('image'), async (req, res) => {
    const { title, category, description, project_url, tech_stack, is_featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const isFeatured = is_featured === 'true' || is_featured === true;

    try {
        const result = await pool.query(
            'INSERT INTO portfolio (title, category, description, image, project_url, tech_stack, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, category, description, image, project_url, tech_stack, isFeatured]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/portfolio/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, category, description, project_url, tech_stack, is_featured } = req.body;
    let image = req.body.image;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }
    const isFeatured = is_featured === 'true' || is_featured === true;

    try {
        const result = await pool.query(
            'UPDATE portfolio SET title = $1, category = $2, description = $3, image = $4, project_url = $5, tech_stack = $6, is_featured = $7 WHERE id = $8 RETURNING *',
            [title, category, description, image, project_url, tech_stack, isFeatured, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/portfolio/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM portfolio WHERE id = $1', [id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TESTIMONIALS ---
router.get('/testimonials', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/testimonials', authenticateToken, upload.single('image'), async (req, res) => {
    const { name, role, content, linkedin_url } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    try {
        const result = await pool.query(
            'INSERT INTO testimonials (name, role, content, image_url, linkedin_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, role, content, image_url, linkedin_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/testimonials/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, role, content, linkedin_url } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const result = await pool.query(
            'UPDATE testimonials SET name = $1, role = $2, content = $3, image_url = $4, linkedin_url = $5 WHERE id = $6 RETURNING *',
            [name, role, content, image_url, linkedin_url, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/testimonials/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
        res.json({ message: 'Testimonial deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SITE CONTENT ---
router.get('/site-content', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM site_content');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/site-content', authenticateToken, upload.single('image'), async (req, res) => {
    const { key } = req.body;
    let { value } = req.body;

    if (req.file) {
        value = `/uploads/${req.file.filename}`;
    }

    try {
        const result = await pool.query(
            'INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2 RETURNING *',
            [key, value]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DNA ---
router.get('/dna', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dna ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/dna', authenticateToken, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    try {
        const result = await pool.query(
            'INSERT INTO dna (title, description, image) VALUES ($1, $2, $3) RETURNING *',
            [title, description, image]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/dna/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    let image = req.body.image;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }

    try {
        const result = await pool.query(
            'UPDATE dna SET title = $1, description = $2, image = $3 WHERE id = $4 RETURNING *',
            [title, description, image, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/dna/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM dna WHERE id = $1', [id]);
        res.json({ message: 'DNA item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- CONTACT SUBMISSIONS ---
router.post('/contact', async (req, res) => {
    const { name, email, phone, website, services, message } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contact_submissions (name, email, phone, website, services, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, phone, website, JSON.stringify(services), message]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/contact/submissions', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/contact/submissions/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/contact/reply', authenticateToken, async (req, res) => {
    const { submission_id, subject, message, to_email } = req.body;
    try {
        // In a real app, send email here using nodemailer
        console.log(`Sending email to ${to_email}: ${subject} - ${message}`);

        const result = await pool.query(
            'INSERT INTO replies (submission_id, subject, message) VALUES ($1, $2, $3) RETURNING *',
            [submission_id, subject, message]
        );

        // Update submission status to 'replied'
        await pool.query(
            "UPDATE contact_submissions SET status = 'replied' WHERE id = $1",
            [submission_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/contact/replies', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, s.name as recipient_name, s.email as recipient_email 
            FROM replies r 
            JOIN contact_submissions s ON r.submission_id = s.id 
            ORDER BY r.sent_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
