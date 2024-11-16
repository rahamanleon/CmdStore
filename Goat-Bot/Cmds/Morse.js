module.exports = {
	config: {
		name: "morse",
		version: "1.0",
		author: "RL",
		countDown: 3,
		role: 0,
		shortDescription: {
			en: "Encode or decode Morse code"
		},
		description: {
			en: "This command encodes a message into Morse code or decodes Morse code into plain text."
		},
		category: "utilities",
		guide: {
			en: "{pn} <encode|decode> <message>"
		}
	},

	langs: {
		en: {
			invalidFormat: "Invalid format. Use: {pn} <encode|decode> <message>",
			invalidAction: "Invalid action! Use 'encode' or 'decode'.",
			result: "Result: %1"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		const morseMap = {
			A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
			H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
			O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
			V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", 1: ".----",
			2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...",
			8: "---..", 9: "----.", 0: "-----", " ": "/", ".": ".-.-.-",
			",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
			"/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
			";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
			"\"": ".-..-.", "$": "...-..-", "@": ".--.-."
		};
		const reverseMorseMap = Object.fromEntries(
			Object.entries(morseMap).map(([key, value]) => [value, key])
		);

		if (args.length < 2) {
			return message.reply(getLang("invalidFormat"));
		}

		const action = args[0].toLowerCase();
		const input = args.slice(1).join(" ");

		if (action === "encode") {
			// Encode to Morse
			const encoded = input
				.toUpperCase()
				.split("")
				.map(char => morseMap[char] || "")
				.join(" ");
			return message.reply(getLang("result", encoded || "Error encoding message"));
		} else if (action === "decode") {
			// Decode from Morse
			const decoded = input
				.split(" ")
				.map(code => reverseMorseMap[code] || "")
				.join("");
			return message.reply(getLang("result", decoded || "Error decoding message"));
		} else {
			return message.reply(getLang("invalidAction"));
		}
	}
};
