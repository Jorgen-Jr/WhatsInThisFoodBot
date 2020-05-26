const nutritionapi = require('../services/nutritionapi');

module.exports = {
    async getRecipeDetails(req) {
        const { ingr, title, yield } = req;
        const response = await nutritionapi.post('' ,{
            ingr, title, yield,
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return err;
        });
        
        return response;
    },
}