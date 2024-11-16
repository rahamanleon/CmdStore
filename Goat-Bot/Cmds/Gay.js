module.exports = {
	config: {
		name: "gay", // Command name
		version: "1.0", // Version
		author: "RL", // Author
		countDown: 5, // Cooldown in seconds
		role: 0, // Role (0: user, 1: admin, 2: owner)
		shortDescription: {
			en: "Tag someone and call them gay"
		}, // Short description
		description: {
			en: "Reply to a user or mention someone to call them gay!"
		}, // Long description
		category: "fun", // Category
		guide: {
			en: "Reply to a message or tag someone using {pn}"
		} // Usage guide
	},

	langs: {
		en: {
			noMention: "Please reply to a message or mention someone.",
			response: "%1 is 100% gay! 🏳️‍🌈"
		}
	},

	onStart: async function ({ message, event, getLang }) {
		// Determine user ID from reply or mention
		let userID, userName;

		if (event.messageReply) {
			userID = event.messageReply.senderID;
			userName = (await global.usersData.get(userID)).name || "This user";
		} else if (Object.keys(event.mentions).length > 0) {
			userID = Object.keys(event.mentions)[0];
			userName = event.mentions[userID];
		} else {
			return message.reply(getLang("noMention"));
		}

		// Respond with the tag and message
		message.reply({
			body: getLang("response", userName),
			mentions: [{ tag: userName, id: userID }]
		});
	}
};
