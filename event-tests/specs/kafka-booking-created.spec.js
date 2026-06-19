const { test, expect } = require('@playwright/test');
const { Kafka, Partitioners } = require('kafkajs');
const Ajv = require('ajv');
const {
    bookingCreatedEventSchema
} = require('../schemas/booking-created-event.schema');

const ajv = new Ajv();

const kafkaEnabled = process.env.KAFKA_ENABLED === 'true';
const broker = process.env.KAFKA_BROKER || 'localhost:9092';
const baseTopic = process.env.KAFKA_TOPIC || 'booking-created';

test.describe('Kafka booking events', () => {
    test.skip(!kafkaEnabled, 'Kafka event tests are optional. Set KAFKA_ENABLED=true to run them.');

    test('should publish and consume a booking.created event with valid contract', async () => {
        test.setTimeout(30000);

        const topic = `${baseTopic}-${Date.now()}`;

        const kafka = new Kafka({
            clientId: 'qa-automation-avl-challenge',
            brokers: [broker]
        });

        const admin = kafka.admin();
        const producer = kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });
        const consumer = kafka.consumer({
            groupId: `qa-booking-consumer-${Date.now()}`
        });

        const eventId = `event-${Date.now()}`;
        const bookingId = Date.now();

        const event = {
            eventId,
            eventType: 'booking.created',
            source: 'qa-automation-avl-challenge',
            occurredAt: new Date().toISOString(),
            payload: {
                bookingId,
                firstname: 'Cristian',
                lastname: 'Cortes',
                totalprice: 350,
                depositpaid: true,
                bookingdates: {
                    checkin: '2026-07-01',
                    checkout: '2026-07-05'
                }
            }
        };

        let consumedEvent;

        try {
            await admin.connect();

            await admin.createTopics({
                waitForLeaders: true,
                topics: [
                    {
                        topic,
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            });

            await producer.connect();
            await consumer.connect();

            await consumer.subscribe({
                topic,
                fromBeginning: true
            });

            const consumedPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Kafka event was not consumed within timeout'));
                }, 15000);

                consumer.run({
                    eachMessage: async ({ message }) => {
                        const value = JSON.parse(message.value.toString());

                        if (value.eventId === eventId) {
                            consumedEvent = value;
                            clearTimeout(timeout);
                            resolve(value);
                        }
                    }
                }).catch(reject);
            });

            // Small wait to ensure consumer group assignment is completed before publishing
            await new Promise((resolve) => setTimeout(resolve, 1500));

            await producer.send({
                topic,
                messages: [
                    {
                        key: String(bookingId),
                        value: JSON.stringify(event)
                    }
                ]
            });

            await consumedPromise;

            const isValidSchema = ajv.validate(bookingCreatedEventSchema, consumedEvent);
            expect(isValidSchema, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();

            expect(consumedEvent.eventType).toBe('booking.created');
            expect(consumedEvent.payload.bookingId).toBe(bookingId);
            expect(consumedEvent.payload.firstname).toBe('Cristian');
        } finally {
            await consumer.disconnect().catch(() => {});
            await producer.disconnect().catch(() => {});
            await admin.disconnect().catch(() => {});
        }
    });
});