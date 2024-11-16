module.exports = {
  config: {
    name: "ttt", // Name of command
    version: "1.0", // Version of command
    author: "RL", // Author of command
    countDown: 5, // Time to wait before executing command again (seconds)
    role: 0, // Role of user to use this command (0: normal user, 1: admin box chat, 2: owner bot)
    shortDescription: {
      en: "Play Tic-Tac-Toe!"
    }, // Short description of command
    description: {
      en: "Play a game of Tic-Tac-Toe with another user."
    }, // Long description of command
    category: "Games", // Category of command
    guide: {
      en: "Type !ttt <user> to challenge another player."
    } // Guide of command
  },

  langs: {
    en: {
      gameStart: "Tic-Tac-Toe game started! %1 will play as X and %2 will play as O.",
      invalidUsage: "To start a game, type `!ttt <user>`.",
      turnMessage: "It's your turn, %1! Choose a position (1-9):\n\n%2",
      invalidPosition: "Invalid position! Choose a number between 1 and 9.",
      gameOver: "Game over! %1 wins!\n\nFinal Board:\n%2",
      drawMessage: "It's a draw! No one wins.\n\nFinal Board:\n%1",
      boardDisplay: "%1 | %2 | %3\n-----------\n%4 | %5 | %6\n-----------\n%7 | %8 | %9"
    }
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, message, event, usersData, getLang }) {
    // Check if the user provided an opponent
    if (args.length === 0) {
      return message.reply(getLang("invalidUsage"));
    }

    const opponentID = args[0];

    // Check if the opponent is a valid user
    if (event.senderID === opponentID) {
      return message.reply("You cannot play against yourself!");
    }

    // Initialize the game state
    const gameState = {
      board: Array(9).fill(null),
      currentPlayer: event.senderID,
      players: {
        [event.senderID]: 'X',  // First player is X
        [opponentID]: 'O'  // Second player is O
      },
      gameOver: false
    };

    // Send game start message
    message.reply(getLang("gameStart", event.senderID, opponentID));

    // Display the game board
    const displayBoard = (board) => {
      return getLang("boardDisplay", ...board.map(cell => cell ? cell : ' '));
    };

    // Start the game loop
    const gameLoop = async () => {
      while (!gameState.gameOver) {
        // Get the current player's turn
        const currentPlayer = gameState.currentPlayer;
        const currentPlayerSymbol = gameState.players[currentPlayer];

        // Ask the player to make a move
        const boardDisplay = displayBoard(gameState.board);
        const promptMessage = getLang("turnMessage", currentPlayer, boardDisplay);
        const sentMessage = await message.reply(promptMessage);

        // Wait for the player's reply
        const filter = (reply) => reply.senderID === currentPlayer && /^[1-9]$/.test(reply.body);
        const reply = await api.waitForReply(sentMessage.messageID, filter);

        const move = parseInt(reply.body);

        // Validate move
        if (gameState.board[move - 1] !== null) {
          await message.reply(getLang("invalidPosition"));
          continue; // Repeat the turn
        }

        // Update the board with the player's move
        gameState.board[move - 1] = currentPlayerSymbol;

        // Check if the game has a winner or is a draw
        const winner = checkWinner(gameState.board);
        if (winner) {
          gameState.gameOver = true;
          await message.reply(getLang("gameOver", currentPlayer, displayBoard(gameState.board)));
        } else if (gameState.board.every(cell => cell !== null)) {
          gameState.gameOver = true;
          await message.reply(getLang("drawMessage", displayBoard(gameState.board)));
        }

        // Switch turns
        gameState.currentPlayer = currentPlayer === event.senderID ? opponentID : event.senderID;
      }
    };

    // Helper function to check for a winner
    function checkWinner(board) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
          return board[a]; // Winner is either 'X' or 'O'
        }
      }
      return null;
    }

    // Start the game loop
    gameLoop();
  }
};
