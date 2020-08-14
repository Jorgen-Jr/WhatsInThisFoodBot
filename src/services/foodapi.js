const api = require('axios');

const foodapi = {
    api: api.create({
        baseURL: 'https://api.edamam.com/api/food-database/',
    }),
    params: '&app_id=' + process.env.FOOD_API_APP_ID + '&app_key=' + process.env.FOOD_API_APP_KEY
};

module.exports = foodapi;