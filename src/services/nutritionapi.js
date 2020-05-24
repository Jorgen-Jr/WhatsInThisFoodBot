const api = require('axios');

const nutritionapi = api.create({
    baseURL: 'http://sampleapi.com/',
});

module.exports = nutritionapi;