module.exports = {
	config: {
		name: "slot", // Command name
		version: "1.0", // Version
		author: "RL", // Author
		countDown: 5, // Cooldown in seconds
		role: 0, // Role (0: user, 1: admin, 2: owner)
		shortDescription: {
			en: "Play a slot machine game"
		}, // Short description
		description: {
			en: "Try your luck at the slot machine and see if you can win!"
		}, // Long description
		category: "games", // Category
		guide: {
			en: "Use {pn} to spin the slot machine and test your luck!"
		} // Usage guide
	},

	langs: {
		en: {
			spinResult: "🎰 Slot Result:\n%1 | %2 | %3\n%4",
			win: "Congratulations! You won! 🎉",
			lose: "Better luck next time! 😢"
		}
	},

	onStart: async function ({ message, getLang }) {
		// Slot machine icons
		const icons = ["🍒", "🍋", "🍊", "🍇", "🍉", "⭐", "💎"];

		// Spin the slot machine
		const spin1 = icons[Math.floor(Math.random() * icons.length)];
		const spin2 = icons[Math.floor(Math.random() * icons.length)];
		const spin3 = icons[Math.floor(Math.random() * icons.length)];

		// Check for a win
		const result = (spin1 === spin2 && spin2 === spin3) ? getLang("win") : getLang("lose");

		// Send the result
		message.reply(getLang("spinResult", spin1, spin2, spin3, result));
	}
};
