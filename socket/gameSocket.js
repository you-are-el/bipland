const { games, updateGameState } = require('../utils/gameUtils');
const alphaStages = require('../data/alphaStages');

module.exports = (io, socket) => {
    let currentSessionId;

    socket.on('join', (data) => {
        const { sessionId, playerName } = data;
        currentSessionId = sessionId;
        if (games[sessionId]) {
            const player = games[sessionId].players.find(p => p.id === socket.id);
            if (!player) {
                games[sessionId].players.push({ id: socket.id, name: playerName, lives: 9, currentStage: 0, tossesRemaining: 0, items: [], visitedStages: [] });
                console.log(`Player ${playerName} (${socket.id}) joined session ID: ${sessionId}`);
            } else {
                player.disconnected = false;
                player.name = playerName;
                console.log(`Player ${playerName} (${socket.id}) rejoined session ID: ${sessionId}`);
            }
            socket.join(sessionId);
            io.to(sessionId).emit('update', { players: games[sessionId].players });
            updateGameState(io, sessionId);
        } else {
            console.log(`Join failed, session ID not found: ${sessionId}`);
        }
    });

    socket.on('start-game', (sessionId) => {
        if (games[sessionId] && !games[sessionId].inProgress) {
            games[sessionId].inProgress = true;
            games[sessionId].currentTurn = 0;
            games[sessionId].players.forEach(player => {
                const currentStage = alphaStages.find(s => s.id === player.currentStage);
                player.tossesRemaining = currentStage.requiredTosses;
            });
            console.log(`Game started with session ID: ${sessionId}`);
            io.to(sessionId).emit('game-start', { sessionId, stages: alphaStages }); // Send stage data to client
            updateGameState(io, sessionId);
        }
    });

    socket.on('toss-coin', (sessionId) => {
        if (games[sessionId] && games[sessionId].inProgress) {
            const game = games[sessionId];
            let player = game.players[game.currentTurn];
            const currentStage = alphaStages.find(s => s.id === player.currentStage);
            player.visitedStages.push(player.currentStage);

            if (player.tossesRemaining > 0) {
                const coinToss = Math.random() < 0.5 ? 'heads' : 'tails';
                console.log(`Coin toss result for player ${player.id}: ${coinToss}`);
                io.to(sessionId).emit('coin-toss-result', coinToss); // Emit coin toss result
                player.tossesRemaining -= 1;
                player.tossResults = player.tossResults || [];
                player.tossResults.push(coinToss);

                if (player.tossesRemaining === 0) {
                    let success = player.tossResults[0] === currentStage.successCondition;

                    if (success) {
                        player.currentStage = currentStage.nextStage.success;
                    } else {
                        player.currentStage = currentStage.nextStage.fail;
                        if (currentStage.loseLifeOnFail) {
                            player.lives -= 1;
                        }
                    }

                    player.tossesRemaining = alphaStages.find(s => s.id === player.currentStage).requiredTosses;
                    player.tossResults = []; // Reset toss results for the next stage

                    console.log(`Player ${player.id} advances to stage ${player.currentStage}`);

                    if (player.currentStage === 11) { // OP_CAT IS ACTIVE!!!!
                        io.to(sessionId).emit('game-end', { message: `${player.name} has won the game!` });
                        game.inProgress = false;
                        setTimeout(() => {
                            io.to(sessionId).emit('game-end-redirect');
                            games[sessionId].players = [];
                        }, 5000);
                    } else if (player.currentStage === 12) { // OP_CAT IS INACTIVE
                        player.lives = 0;
                        io.to(sessionId).emit('update', { players: game.players });
                        io.to(sessionId).emit('player-lose', { message: `${player.name} has lost the game!` });
                    }
                }

                game.currentTurn = (game.currentTurn + 1) % game.players.length;
                updateGameState(io, sessionId);
            }
        }
    });

    socket.on('end-game', (sessionId) => {
        if (games[sessionId] && games[sessionId].inProgress) {
            games[sessionId].inProgress = false;
            console.log(`Game ended with session ID: ${sessionId}`);
            io.to(sessionId).emit('game-end');
            games[sessionId].players = [];
        }
    });

    socket.on('disconnect', () => {
        if (currentSessionId && games[currentSessionId]) {
            const playerIndex = games[currentSessionId].players.findIndex(player => player.id === socket.id);
            if (playerIndex !== -1) {
                console.log(`Player ${socket.id} disconnected from session ID: ${currentSessionId}`);
                games[currentSessionId].players[playerIndex].disconnected = true;
                setTimeout(() => {
                    if (games[currentSessionId]) {
                        const player = games[currentSessionId].players.find(p => p.id === socket.id);
                        if (player && player.disconnected) {
                            console.log(`Removing player ${socket.id} from session ID: ${currentSessionId} after timeout`);
                            games[currentSessionId].players.splice(playerIndex, 1);
                            if (games[currentSessionId].players.length === 0 && !games[currentSessionId].inProgress) {
                                delete games[currentSessionId];
                                console.log(`Session ID deleted: ${currentSessionId}`);
                            } else {
                                io.to(currentSessionId).emit('update', { players: games[currentSessionId].players });
                                updateGameState(io, currentSessionId);
                            }
                        }
                    }
                }, 10000);
            }
        }
    });
};