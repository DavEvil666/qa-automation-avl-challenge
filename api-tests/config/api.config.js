require('dotenv').config();

module.exports = {
    baseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
    defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    slaMs: 1500
};