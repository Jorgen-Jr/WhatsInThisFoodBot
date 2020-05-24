const nutritionapi = require('../services/nutritionapi');

module.exports = {
    async sampleRequest(req) {
        const response = await nutritionapi.get(req + '?notfound=floor')
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return false;
        });
        
        return response;
    },
}