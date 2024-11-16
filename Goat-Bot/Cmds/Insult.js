module.exports = {
	config: {
		name: "insult",
		version: "1.2",
		author: "RL",
		countDown: 3,
		role: 0,
		shortDescription: {
			en: "Tag and insult a user"
		},
		description: {
			en: "This command tags a user and sends a random playful insult."
		},
		category: "fun",
		guide: {
			en: "{pn} [@mention/reply]"
		}
	},

	langs: {
		en: {
			noTarget: "You need to mention someone or reply to their message!",
			insult: "@%1, %2!"
		}
	},

	onStart: async function ({ api, event, args, message, getLang }) {
		const insults = [
			"is proof that even evolution takes a day off",
			"has something on their mind, but nothing in it",
			"is the human equivalent of a participation trophy",
			"brings everyone so much joy—when they leave the room",
			"shouldn't play hide and seek; no one would bother looking for them",
			"fell out of the stupid tree and hit every branch on the way down",
			"brings everyone joy, just by logging out",
			"has something in common with a cloud—when they disappear, it's a beautiful day",
			"was born on a highway, because that's where most accidents happen",
			"is like a cloud: pretty useless and just floating around",
			"is about as useful as a screen door on a submarine",
			"is a few fries short of a Happy Meal",
			"hasn't been the same since the doctor slapped them at birth",
			"couldn't pour water out of a boot if the instructions were on the heel",
			"is the reason shampoo bottles have instructions",
			"makes onions cry",
			"should consider duct tape for their personality—it's loud and annoying",
			"wouldn't be the sharpest tool in the shed, even if it were empty",
			"is like a software bug, except nobody is rushing to fix them",
			"has the intellectual depth of a puddle in the desert"
		];

		// Determine target
		let targetID = "";
		let targetName = "";

		if (event.mentions && Object.keys(event.mentions).length > 0) {
			const mentionedIDs = Object.keys(event.mentions);
			targetID = mentionedIDs[0];
			targetName = event.mentions[targetID];
		} else if (event.messageReply) {
			targetID = event.messageReply.senderID;
			const userInfo = await api.getUserInfo(targetID);
			targetName = userInfo[targetID].name || "Someone";
		}

		// If no target found, notify user
		if (!targetID) {
			return message.reply(getLang("noTarget"));
		}

		// Select a random insult
		const randomInsult = insults[Math.floor(Math.random() * insults.length)];

		// Send insult with tag
		api.sendMessage({
			body: getLang("insult", targetName, randomInsult),
			mentions: [{
				tag: targetName,
				id: targetID
			}]
		}, event.threadID);
	}
};
