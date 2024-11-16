//its in beta stage.
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "cmdstore",
    version: "1.0",
    author: "RL",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Search and view commands"
    },
    description: {
      en: "Fetch and display commands from the CmdStore repository"
    },
    category: "utility",
    guide: {
      en: "{pn} [command name]"
    }
  },

  langs: {
    en: {
      noMatch: "No matching command found.",
      similarResults: "Similar results:",
      fetching: "Fetching the list of commands...",
      error: "Something went wrong. Please try again later."
    }
  },

  onStart: async function ({ args, message, getLang }) {
    const cmdName = args.join(" ").toLowerCase();
    const rawUrl = "https://api.github.com/repos/rahamanleon/CmdStore/contents/Goat-Bot/Cmds";

    try {
      message.reply(getLang("fetching"));

      // Fetch the list of commands from the repository
      const response = await fetch(rawUrl);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format.");
      }

      // Filter for .js files
      const jsFiles = data
        .filter(item => item.name.endsWith(".js"))
        .map(item => item.name.replace(".js", ""));

      if (cmdName) {
        // Match exact command name
        const exactMatch = jsFiles.find(name => name === cmdName);

        if (exactMatch) {
          message.reply(`**Command:** ${exactMatch}\n**Raw URL:** ${rawUrl}/${exactMatch}.js`);
        } else {
          // Find similar commands
          const similar = jsFiles.filter(name => name.includes(cmdName));
          const similarText = similar.length
            ? `${getLang("similarResults")}\n${similar.join(", ")}`
            : getLang("noMatch");

          message.reply(similarText);
        }
      } else {
        // If no command name provided, list all commands
        message.reply(`**Available Commands:**\n${jsFiles.join(", ")}`);
      }
    } catch (error) {
      console.error(error);
      message.reply(getLang("error"));
    }
  }
};
