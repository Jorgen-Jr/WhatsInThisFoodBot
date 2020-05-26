const api = require('axios');

const nutritionapi = api.create({
    baseURL: 'https://api.edamam.com/api/nutrition-details?app_id=' + process.env.NUTRITION_API_APP_ID + '&app_key=' + process.env.NUTRITION_API_APP_KEY,
});

module.exports = nutritionapi;