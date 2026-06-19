const bookingCreatedEventSchema = {
    type: 'object',
    required: [
        'eventId',
        'eventType',
        'source',
        'occurredAt',
        'payload'
    ],
    properties: {
        eventId: { type: 'string' },
        eventType: { const: 'booking.created' },
        source: { const: 'qa-automation-avl-challenge' },
        occurredAt: { type: 'string' },
        payload: {
            type: 'object',
            required: [
                'bookingId',
                'firstname',
                'lastname',
                'totalprice',
                'depositpaid',
                'bookingdates'
            ],
            properties: {
                bookingId: { type: 'number' },
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
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};

module.exports = {
    bookingCreatedEventSchema
};