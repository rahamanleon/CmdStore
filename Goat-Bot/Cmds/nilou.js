const axios = require('axios');

module.exports = {
  config: {
    name: "nilou",
    version: "1.0",
    author: "RL",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Chat continuously with Nilou (⁠+⁠_⁠+⁠)"
    },
    description: {
      en: "Send a message to initiate chat with Nilou Chat bot and continue the conversation by replying."
    },
    category: "Fun",
    guide: {
      en: "Usage: <your message> or reply directly to the bot to continue the conversation."
    }
  },

  // Start command
  onStart: async function ({ api, args, message }) {
    await handleMessage(api, args, message);
  },

  // Handle conversation continuation
  onReply: async function ({ api, event, args, message }) {
    await handleMessage(api, args, message);
  }
};

// Fetch API URL from GitHub-hosted JSON
async function getAPIUrl(apiName) {
  const apiConfigUrl = 'https://raw.githubusercontent.com/rahamanleon/RL-Apis/main/RL-apis.json';
  try {
    const response = await axios.get(apiConfigUrl);
    const apiUrl = response.data.apis[apiName];
    if (!apiUrl) throw new Error(`API "${apiName}" not found.`);
    return apiUrl;
  } catch (error) {
    console.error('Error fetching API URL:', error.message);
    throw error;
  }
}

// Core message handling function
async function handleMessage(api, args, message) {
  const userMessage = args.join(" ").trim();
  if (!userMessage) return message.reply("Please type a message to chat with Nilou Chat bot.");

  try {
    // Fetch the base API URL for 'nilou' from GitHub JSON
    const apiUrl = await getAPIUrl('nilou');
    const response = await axios.get(`${apiUrl}/${encodeURIComponent(userMessage)}`);

    // Check if the response has the expected 'reply' field
    if (response.data.reply) {
      message.reply(response.data.reply, (err, sentMessage) => {
        if (!err) {
          global.GoatBot.onReply.set(sentMessage.messageID, {
            commandName: module.exports.config.name,
            uid: message.senderID // Track the user for the reply loop
          });
        }
      });
    } else {
      message.reply("I didn’t get a valid reply from the API.");
    }
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    message.reply("Sorry, I encountered an error while processing your message.");
  }
}
