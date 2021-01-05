
const axios = require('axios');
const FoodController = require('../src/controllers/FoodController');

const nutrientsMap = require('./../src/util/nutrients');

exports.handler = async event => {

    const body = event.body;

    const req = JSON.parse(body);

    const {
        message,
        inline_query,
    } = req;

    console.log('Update received: ', req);

    const bot_url = "https://api.telegram.org/bot" + process.env.BOT_TOKEN;

    console.log('BOT endpoint: ' + bot_url);

    let response = {};

    const food = inline_query.query;

    if (food) {
        console.log("Fetching foog: " + food);
        if (inline_query) {

            const response = await FoodController.getFoodItem(queryContent);

            response.parsed.map((item) => {
                const getNutrients = nutrientsMap.filter(nutrient => {
                    return item.food.nutrients.hasOwnProperty(nutrient.identifier);
                });

                const nutrients = getNutrients.map(nutrient => {
                    return '  - ' + nutrient.name + ': ' + item.food.nutrients[nutrient.identifier].toFixed(3) + nutrient.unit + '\n';
                });

                try {
                    results.push({
                        type: 'Article',
                        id: 'user' + item.food.foodId,
                        title: 'You Inserted: ' + item.food.label,
                        thumb_url: item.food.image,
                        description: 'Categoria: ' + item.food.category + (item.quantity ? '\nQuantity: ' + item.quantity : ''),
                        input_message_content: {
                            parse_mode: 'HTML',
                            message_text: '<b>' + (item.quantity ? item.quantity : '') + ' ' + item.food.label + '</b>\n' +
                                'Measure: ' + item.measure.label + '\n' +
                                'Nutrients: \n' +
                                nutrients.join('') +
                                '<a href="' + item.food.image + '">Food Image</a>'
                        },
                    })
                } catch (err) {
                    console.log(err);
                }
            });

            response.hints.map((item, index) => {
                const getNutrients = nutrientsMap.filter(nutrient => {
                    return item.food.nutrients.hasOwnProperty(nutrient.identifier);
                });

                const nutrients = getNutrients.map(nutrient => {
                    return '  - <i>' + nutrient.name + '</i>: ' + item.food.nutrients[nutrient.identifier].toFixed(3) + nutrient.unit + '\n';
                });

                try {
                    results.push({
                        type: 'Article',
                        id: item.food.foodId + index,
                        title: item.food.label,
                        thumb_url: item.food.image,
                        description: 'Category: ' + item.food.category + '\nKind: ' + item.food.categoryLabel,
                        input_message_content: {
                            parse_mode: 'HTML',
                            message_text: '<b>' + item.food.label + '</b>\n' +
                                '<b>Kind:</b> ' + item.food.categoryLabel + '\n' +
                                (item.food.brand ? '<b>Brand:</b> ' + item.food.brand + '\n' : '') +
                                '<b>Category:</b> ' + item.food.category + '\n' +
                                '<b>Nutrients:</b> \n' +
                                nutrients.join('') +
                                (item.food.foodContentsLabel ? "<b>What's inside:</b> " + item.food.foodContentsLabel + '\n' : '') +
                                (item.food.image ? '<a href="' + item.food.image + '">Food Image</a>' : '')
                        },
                    })
                } catch (err) {
                    console.log(err);
                }
            });

            await answerInlineQuery({
                inline_query_id: inline_query.id,
                results
            });

        }
        else if (message) {
            const chatId = message.chat.id;

            /* Answer message. */

            response = {
                chat_id: chatId,
                text: "Sorry, coudn't catch that 😢 \nPlease use only inline commands for now",
                parse_mode,
            }

            const res = await sendMessage(response);
            console.log("Response generated: ", res.data);

        }
    }

    async function sendMessage(response) {
        return await axios.post('https://nwhatsinthisfood.netlify.app/.netlify/functions/answerInlineQuery', response);
    }

    async function answerInlineQuery(response) {
        return await axios.post('https://nwhatsinthisfood.netlify.app/.netlify/functions/sendMessage', response);
    }

    return {
        statusCode: 200,

        body: JSON.stringify(response),
    }

}