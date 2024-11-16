module.exports = {
	config: {
		name: "emojiQuiz",
		version: "3.0",
		author: "RL",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Guess the phrase based on emojis!"
		},
		description: {
			en: "A fun and challenging game where users guess the word, phrase, or title represented by emojis."
		},
		category: "games",
		guide: {
			en: "{prefix}{name} to start the game\nReply with your guess to win! Use 'hint' for a clue."
		}
	},

	langs: {
		en: {
			start: "Guess the phrase from these emojis: %1",
			correct: "🎉 Correct! The answer was '%1'. Your score: %2",
			incorrect: "❌ Incorrect! Try again.",
			hint: "🧐 Hint: %1",
			timeout: "⏰ Time's up! The correct answer was '%1'. Your final score: %2.",
			gameOver: "🎮 Game Over! Your total score: %1.",
			nextRound: "➡️ Next puzzle: %1"
		}
	},

	onStart: async function ({ message, getLang }) {
		// Expanded list of emoji puzzles
		const puzzles = [
			{ emojis: "🌞🌻", answer: "Sunflower", hint: "A bright flower" },
			{ emojis: "🐱🐟", answer: "Catfish", hint: "A fishy feline" },
			{ emojis: "💔💵", answer: "Heartbreak", hint: "A broken feeling" },
			{ emojis: "🍎📚", answer: "Apple Books", hint: "A fruity book app" },
			{ emojis: "🎥👻", answer: "Ghostbusters", hint: "Who you gonna call?" },
			{ emojis: "🐝🍯", answer: "Honeybee", hint: "A sweet insect" },
			{ emojis: "🌍🕊️", answer: "World Peace", hint: "A peaceful planet" },
			{ emojis: "🔥💧", answer: "Firewater", hint: "Opposite elements" },
			{ emojis: "🎵🎤", answer: "Sing Song", hint: "Musical activity" },
			{ emojis: "👑🦁", answer: "Lion King", hint: "A Disney movie" },
			{ emojis: "🍔🍟", answer: "Fast Food", hint: "Quick meal" },
			{ emojis: "🚀🌌", answer: "Space Exploration", hint: "Traveling beyond Earth" },
			{ emojis: "🏠🔥", answer: "House on Fire", hint: "A disaster scenario" },
			{ emojis: "🦷🧚", answer: "Tooth Fairy", hint: "A mythical collector" },
			{ emojis: "📦🚪", answer: "Package Delivery", hint: "A common online service" },
			{ emojis: "🐕🦴", answer: "Dog Bone", hint: "A pet's favorite treat" },
			{ emojis: "💤💡", answer: "Sleep Idea", hint: "Inspiration while dreaming" },
			{ emojis: "🛠️⚙️", answer: "Toolbox", hint: "A repair kit" },
			{ emojis: "🎂🎉", answer: "Birthday Party", hint: "A celebration" },
			{ emojis: "✈️🎫", answer: "Plane Ticket", hint: "Travel preparation" },
			{ emojis: "🏃‍♂️🏅", answer: "Marathon Winner", hint: "Achievement after running" },
			{ emojis: "🔒🔑", answer: "Lock and Key", hint: "Essential for security" },
			{ emojis: "🕶️👨‍💻", answer: "Cool Hacker", hint: "A stylish tech enthusiast" },
			{ emojis: "🚗⚡", answer: "Electric Car", hint: "Eco-friendly vehicle" },
			{ emojis: "🍩🍫", answer: "Sweet Snacks", hint: "Indulgent treats" },
			{ emojis: "📱📞", answer: "Phone Call", hint: "A common communication method" },
			{ emojis: "🐢⏳", answer: "Slow Time", hint: "Taking it easy" },
			{ emojis: "🌈✨", answer: "Rainbow Sparkle", hint: "Colorful magic" },
			{ emojis: "🩴🏖️", answer: "Beach Sandals", hint: "Footwear for the shore" },
			// Add more entries as needed up to 60+
		];

		let score = 0;
		let rounds = 5; // Number of puzzles in one game

		for (let i = 0; i < rounds; i++) {
			const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
			let attempts = 3; // Max attempts per puzzle

			// Send the emoji puzzle
			await message.reply(getLang("start", puzzle.emojis));

			while (attempts > 0) {
				const timeout = 30000; // 30 seconds to answer
				const filter = (reply) => reply.body.trim().toLowerCase();
				const guess = await message.awaitReply({ filter, timeout });

				if (!guess) {
					await message.reply(getLang("timeout", puzzle.answer, score));
					return;
				}

				const userGuess = guess.body.trim().toLowerCase();

				if (userGuess === puzzle.answer.toLowerCase()) {
					score += 10; // Increment score for correct answer
					await message.reply(getLang("correct", puzzle.answer, score));
					break;
				} else if (userGuess === "hint") {
					await message.reply(getLang("hint", puzzle.hint));
				} else {
					attempts--;
					await message.reply(getLang("incorrect"));
					if (attempts === 0) {
						await message.reply(getLang("timeout", puzzle.answer, score));
					}
				}
			}

			if (i < rounds - 1) {
				await message.reply(getLang("nextRound", puzzles[Math.floor(Math.random() * puzzles.length)].emojis));
			}
		}

		// End of game
		await message.reply(getLang("gameOver", score));
	}
};
