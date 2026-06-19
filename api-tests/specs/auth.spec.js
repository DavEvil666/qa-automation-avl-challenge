const { test, expect, request } = require('@playwright/test');
const Ajv = require('ajv');
const apiConfig = require('../config/api.config');

const ajv = new Ajv();

const authSchema = {
    type: 'object',
    required: ['token'],
    properties: {
        token: { type: 'string' }
    },
    additionalProperties: false
};

test.describe.configure({ retries: 1 });

test.describe('Auth API', () => {
    test('should generate an auth token successfully', async () => {
        const apiContext = await request.newContext({
            baseURL: apiConfig.baseURL,
            extraHTTPHeaders: apiConfig.defaultHeaders
        });

        try {
            // Warm-up request to avoid measuring DNS/TLS/public API cold start as endpoint SLA
            await apiContext.get('/ping');

            const payload = {
                username: 'admin',
                password: 'password123'
            };

            const startTime = Date.now();

            const response = await apiContext.post('/auth', {
                data: payload
            });

            const responseTime = Date.now() - startTime;
            const body = await response.json();

            console.log(`Auth response time: ${responseTime} ms`);

            expect(response.status()).toBe(200);
            expect(responseTime).toBeLessThan(apiConfig.slaMs);

            const isValidSchema = ajv.validate(authSchema, body);
            expect(isValidSchema, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();

            expect(body.token).toBeTruthy();
        } finally {
            await apiContext.dispose();
        }
    });
});