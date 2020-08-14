const foodapi = require('../services/foodapi');

module.exports = {
    async getFoodItem(req) {
        const response = await foodapi.api.get('parser?ingr=' + req + foodapi.params)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        });
        
        return response;
    },
}