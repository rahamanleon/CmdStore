const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "cs",
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
      fetching: "Loading the list of available commands, please wait...",
      error: "Something went wrong. Please try again later."
    }
  },

  onStart: async function ({ args, message, getLang }) {
    const cmdName = args.join(" ").toLowerCase();
    const repoUrl = "https://api.github.com/repos/rahamanleon/CmdStore/contents/Goat-Bot/Cmds";

    try {
      message.reply(getLang("fetching"));  // Sends the loading message

      // Fetch the list of commands from the repository
      const response = await fetch(repoUrl);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format.");
      }

      // Filter for .js files
      const jsFiles = data.filter(item => item.name.endsWith(".js"));

      if (cmdName) {
        // Match exact command name
        const exactMatch = jsFiles.find(item => item.name.replace(".js", "").toLowerCase() === cmdName);

        if (exactMatch) {
          // Construct the raw URL for the command file
          const rawUrl = `https://raw.githubusercontent.com/rahamanleon/CmdStore/main/Goat-Bot/Cmds/${exactMatch.name}`;
          
          // Fetch the command file's metadata to get the short description
          const commandResponse = await fetch(rawUrl);
          const commandFile = await commandResponse.text();
          
          // Extract the shortDescription from the command file
          const shortDescriptionMatch = commandFile.match(/shortDescription: {[^}]+en: "(.*?)"/);
          const description = shortDescriptionMatch ? shortDescriptionMatch[1] : "No description available.";

          message.reply(`${exactMatch.name.replace(".js", "")}: ${description}\nRaw URL: ${rawUrl}`);
        } else {
          // Find similar commands
          const similar = jsFiles.filter(item => item.name.includes(cmdName));
          const similarText = similar.length
            ? `${getLang("similarResults")}\n${similar.map(item => `${item.name.replace(".js", "")}: ${item.name}`).join("\n")}`
            : getLang("noMatch");

          message.reply(similarText);
        }
      } else {
        // If no command name provided, list all commands with descriptions in numbered format
        let commandList = "";
        for (let i = 0; i < jsFiles.length; i++) {
          const rawUrl = `https://raw.githubusercontent.com/rahamanleon/CmdStore/main/Goat-Bot/Cmds/${jsFiles[i].name}`;

          // Fetch the command file's metadata to get the short description
          const commandResponse = await fetch(rawUrl);
          const commandFile = await commandResponse.text();
          
          // Extract the shortDescription from the command file
          const shortDescriptionMatch = commandFile.match(/shortDescription: {[^}]+en: "(.*?)"/);
          const description = shortDescriptionMatch ? shortDescriptionMatch[1] : "No description available.";

          commandList += `${i + 1}. ${jsFiles[i].name.replace(".js", "")}: ${description}\n`;
        }

        message.reply(`Here are the available commands:\n${commandList}`);
      }
    } catch (error) {
      console.error(error);
      message.reply(getLang("error"));
    }
  }
};
