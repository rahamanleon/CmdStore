module.exports = {
	config: {
		name: "profile", // Command name
		version: "1.0", // Version
		author: "RL", // Author
		countDown: 5, // Cooldown in seconds
		role: 0, // Role (0: user, 1: admin, 2: owner)
		shortDescription: {
			en: "Show user profile picture"
		}, // Short description
		description: {
			en: "Sends the profile picture of the user you reply to."
		}, // Long description
		category: "info", // Category
		guide: {
			en: "Reply to a message and use {pn} to get the user's profile picture."
		} // Usage guide
	},

	langs: {
		en: {
			noReply: "Please reply to a user's message to get their profile picture.",
			error: "Could not retrieve the profile picture for this user."
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		// Check if the message is a reply
		if (!event.messageReply) {
			return message.reply(getLang("noReply"));
		}

		// Get the user ID from the replied message
		const userID = event.messageReply.senderID;

		try {
			// Get the profile picture URL
			const userInfo = await api.getUserInfo(userID);
			const user = userInfo[userID];
			const profilePic = user.profileUrl;

			// Send the profile picture
			message.reply({
				body: `👤 Profile Picture of ${user.name || "User"}:`,
				attachment: await global.utils.getStreamFromURL(profilePic)
			});
		} catch (error) {
			console.error(error);
			message.reply(getLang("error"));
		}
	}
};
