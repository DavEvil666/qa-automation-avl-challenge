const bookingSchema = {
    type: 'object',
    required: [
        'firstname',
        'lastname',
        'totalprice',
        'depositpaid',
        'bookingdates',
        'additionalneeds'
    ],
    properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        totalprice: { type: 'number' },
        depositpaid: { type: 'boolean' },
        bookingdates: {
            type: 'object',
            required: ['checkin', 'checkout'],
            properties: {
                checkin: { type: 'string' },
                checkout: { type: 'string' }
            },
            additionalProperties: false
        },
        additionalneeds: { type: 'string' }
    },
    additionalProperties: false
};

const createBookingResponseSchema = {
    type: 'object',
    required: ['bookingid', 'booking'],
    properties: {
        bookingid: { type: 'number' },
        booking: bookingSchema
    },
    additionalProperties: false
};

module.exports = {
    bookingSchema,
    createBookingResponseSchema
};