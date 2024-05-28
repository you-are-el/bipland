const games = {};

function updateGameState(io, sessionId) {
    const game = games[sessionId];
    if (game && game.players.length > 0) {
        console.log(`Updating game state for session ID: ${sessionId}`);
        console.log(`Current game state: ${JSON.stringify(game)}`);
        io.to(sessionId).emit('game-update', {
            players: game.players,
            currentTurn: game.players[game.currentTurn].id,
            inProgress: game.inProgress // Include inProgress field
        });
    } else {
        console.log(`Game ended for session ID: ${sessionId}`);
        io.to(sessionId).emit('game-end');
        game.inProgress = false;
        game.players = [];
    }
}

module.exports = { games, updateGameState };