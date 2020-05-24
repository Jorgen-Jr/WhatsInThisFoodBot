
const TelegramBot = require('node-telegram-bot-api');
const SomeController = require('./controllers/SomeController');

const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('inline_query', async (query) => {
  const queryId = query.id;
  const queryContent = query.query;
  let results = [];

  if (queryContent) {
    let facts = [];

    results.push({
      type: 'Article',
      id: index,
      title: 'fact.title',
      description: 'fact.description',
      input_message_content: {
        message_text: 'fact.description',
      },
    })
  }

  bot.answerInlineQuery(queryId, results)
});

// Listen for any kind of message.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'To use this bot...');
});