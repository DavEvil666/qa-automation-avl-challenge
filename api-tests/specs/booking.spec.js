const { test, expect, request } = require('@playwright/test');
const Ajv = require('ajv');
const apiConfig = require('../config/api.config');
const {
    bookingSchema,
    createBookingResponseSchema
} = require('../schemas/booking.schema');

const ajv = new Ajv();

test.describe.serial('Booking API', () => {
    let apiContext;
    let token;
    let bookingId;

    test.beforeAll(async () => {
        apiContext = await request.newContext({
            baseURL: apiConfig.baseURL,
            extraHTTPHeaders: apiConfig.defaultHeaders
        });

        const authResponse = await apiContext.post('/auth', {
            data: {
                username: 'admin',
                password: 'password123'
            }
        });

        expect(authResponse.status()).toBe(200);

        const authBody = await authResponse.json();
        token = authBody.token;

        expect(token).toBeTruthy();
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test('should create a booking successfully', async () => {
        const payload = {
            firstname: `Cristian-${Date.now()}`,
            lastname: 'Cortes',
            totalprice: 350,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-07-01',
                checkout: '2026-07-05'
            },
            additionalneeds: 'QA Automation Challenge'
        };

        const startTime = Date.now();

        const response = await apiContext.post('/booking', {
            data: payload
        });

        const responseTime = Date.now() - startTime;
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(responseTime).toBeLessThan(apiConfig.slaMs);

        const isValidSchema = ajv.validate(createBookingResponseSchema, body);
        expect(isValidSchema, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();

        expect(body.booking.firstname).toBe(payload.firstname);
        expect(body.booking.lastname).toBe(payload.lastname);
        expect(body.booking.totalprice).toBe(payload.totalprice);
        expect(body.booking.depositpaid).toBe(payload.depositpaid);

        bookingId = body.bookingid;
        expect(bookingId).toBeTruthy();
    });

    test('should update a booking successfully', async () => {
        const payload = {
            firstname: `Updated-${Date.now()}`,
            lastname: 'Cortes Senior QA',
            totalprice: 500,
            depositpaid: false,
            bookingdates: {
                checkin: '2026-08-01',
                checkout: '2026-08-10'
            },
            additionalneeds: 'Updated by Playwright API test'
        };

        const startTime = Date.now();

        const response = await apiContext.put(`/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${token}`
            },
            data: payload
        });

        const responseTime = Date.now() - startTime;
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(responseTime).toBeLessThan(apiConfig.slaMs);

        const isValidSchema = ajv.validate(bookingSchema, body);
        expect(isValidSchema, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();

        expect(body.firstname).toBe(payload.firstname);
        expect(body.lastname).toBe(payload.lastname);
        expect(body.totalprice).toBe(payload.totalprice);
        expect(body.depositpaid).toBe(payload.depositpaid);
        expect(body.additionalneeds).toBe(payload.additionalneeds);
    });
});