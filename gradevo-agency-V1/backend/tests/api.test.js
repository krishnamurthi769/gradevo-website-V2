import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

// Mock the database pool
vi.mock('../db.js', () => ({
    pool: {
        query: vi.fn(),
    },
}));

import { pool } from '../db.js';

describe('GET /api/content/services', () => {
    it('should return 200 and a list of services', async () => {
        // Mock database response
        const mockServices = [
            { id: 1, title: 'Web Design', description: 'Creating beautiful sites', icon: 'figma' }
        ];
        pool.query.mockResolvedValue({ rows: mockServices });

        const res = await request(app).get('/api/content/services');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockServices);
        expect(pool.query).toHaveBeenCalled();
    });
});
