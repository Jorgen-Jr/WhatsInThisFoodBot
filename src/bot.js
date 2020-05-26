
const TelegramBot = require('node-telegram-bot-api');
const FoodController = require('./controllers/FoodController');
const NutritionController = require('./controllers/NutritionController');

const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const nutrientsMap = [
  {
    identifier: 'CA',
    name: 'Calcium',
    unit: 'mg'
  },
  {
    identifier: 'CHOCDF',
    name: 'Carbs',
    unit: 'g'
  },
  {
    identifier: 'CHOLE',
    name: 'Cholesterol',
    unit: 'mg'
  },
  {
    identifier: 'FAMS',
    name: 'Monounsaturated',
    unit: 'g'
  },
  {
    identifier: 'FAPU',
    name: 'Polyunsaturated',
    unit: 'g'
  },
  {
    identifier: 'FASAT',
    name: 'Saturated',
    unit: 'g'
  },
  {
    identifier: 'FAT',
    name: 'Fat',
    unit: 'g'
  },
  {
    identifier: 'FATRN',
    name: 'Trans',
    unit: 'g'
  },
  {
    identifier: 'FE',
    name: 'Iron',
    unit: 'mg'
  },
  {
    identifier: 'FIBTG',
    name: 'Fiber',
    unit: 'g'
  },
  {
    identifier: 'FOLDFE',
    name: 'Folate (Equivalent)',
    unit: 'æg'
  },
  {
    identifier: 'K',
    name: 'Potassium',
    unit: 'mg'
  },
  {
    identifier: 'MG',
    name: 'Magnesium',
    unit: 'mg'
  },
  {
    identifier: 'NA',
    name: 'Sodium',
    unit: 'mg'
  },

  {
    identifier: 'ENERC_KCAL',
    name: 'Energy',
    unit: 'kcal'
  },
  {
    identifier: 'NIA',
    name: 'Niacin (B3)',
    unit: 'mg'
  },
  {
    identifier: 'P',
    name: 'Phosphorus',
    unit: 'mg'
  },
  {
    identifier: 'PROCNT',
    name: 'Protein',
    unit: 'g'
  },
  {
    identifier: 'RIBF',
    name: 'Riboflavin (B2)',
    unit: 'mg'
  },
  {
    identifier: 'SUGAR',
    name: 'Sugars',
    unit: 'g'
  },
  {
    identifier: 'THIA',
    name: 'Thiamin (B1)',
    unit: 'mg'
  },
  {
    identifier: 'TOCPHA',
    name: 'Vitamin E',
    unit: 'mg'
  },
  {
    identifier: 'VITA_RAE',
    name: 'Vitamin A',
    unit: 'æg'
  },
  {
    identifier: 'VITB12',
    name: 'Vitamin B12',
    unit: 'æg'
  },
  {
    identifier: 'VITB6A',
    name: 'Vitamin B6',
    unit: 'mg'
  },
  {
    identifier: 'VITC',
    name: 'Vitamin C',
    unit: 'mg'
  },
  {
    identifier: 'VITD',
    name: 'Vitamin D',
    unit: 'æg'
  },
  {
    identifier: 'VITK1',
    name: 'Vitamin K',
    unit: 'æg'
  },
]

bot.on('inline_query', async (query) => {
  const queryId = query.id;
  const queryContent = query.query.replace(' ', '%20');
  let results = [];

  if (queryContent) {
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

  }

  bot.answerInlineQuery(queryId, results)
});

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  // let title = "";
  // let prep = "";
  // let ingr = [];

  // const req = {
  //   title, prep, ingr
  // }
  
  // const response = await NutritionController.getRecipeDetails(req);

  // console.log(response);

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Sorry, coudn\'t catch that 😢 \nPlease use only inline commands for now.');
});