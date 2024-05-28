const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const lobby = document.getElementById('lobby');
    const game = document.getElementById('game');
    const hostButton = document.getElementById('host-game');
    const joinButton = document.getElementById('join-game');
    const startButton = document.getElementById('start-game');
    const endButton = document.getElementById('end-game');
    const tossButton = document.getElementById('toss-coin');
    const sessionIdInput = document.getElementById('session-id');
    const playerNameInput = document.getElementById('player-name');
    const sessionInfo = document.getElementById('session-info');
    const copySessionIdButton = document.getElementById('copy-session-id');
    const playerList = document.getElementById('player-list');
    const livesImages = document.getElementById('lives-images');
    const itemsList = document.getElementById('items-list');
    const piecesContainer = document.getElementById('pieces-container');
    const coinTossResult = document.getElementById('coin-toss-result');
    const messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    document.body.appendChild(messageContainer);

    let sessionId = null;
    let stages = [];

    hostButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim() || 'Player';
        fetch('/host')
            .then(response => response.json())
            .then(data => {
                sessionId = data.sessionId;
                sessionInfo.innerText = `Session ID: ${sessionId}`;
                copySessionIdButton.style.display = 'block';
                socket.emit('join', { sessionId, playerName });
                startButton.style.display = 'block';
            });
    });

    joinButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim() || 'Player';
        sessionId = sessionIdInput.value;
        socket.emit('join', { sessionId, playerName });
        sessionInfo.innerText = `Joined session: ${sessionId}`;
    });

    startButton.addEventListener('click', () => {
        socket.emit('start-game', sessionId);
    });

    endButton.addEventListener('click', () => {
        socket.emit('end-game', sessionId);
        lobby.style.display = 'block';
        game.style.display = 'none';
        messageContainer.innerText = ''; // Clear messages on game end
    });

    tossButton.addEventListener('click', () => {
        const tossAnimation = setInterval(() => {
            const img = document.createElement('img');
            img.src = Math.random() < 0.5 ? '/heads.png' : '/tails.png';
            img.alt = 'tossing';
            img.className = 'coin-toss-image';
            coinTossResult.innerHTML = '';
            coinTossResult.appendChild(img);
        }, 100);

        setTimeout(() => {
            clearInterval(tossAnimation);
            socket.emit('toss-coin', sessionId);
        }, 1000);
    });

    copySessionIdButton.addEventListener('click', () => {
        navigator.clipboard.writeText(sessionId).then(() => {
            alert('Session ID copied to clipboard!');
        });
    });

    socket.on('game-start', (data) => {
        stages = data.stages; // Receive stage data from server
        lobby.style.display = 'none';
        game.style.display = 'block';
        updateTossesDisplay(0); // Initialize tosses display
    });

    socket.on('game-end', (data) => {
        alert(data.message);
        setTimeout(() => {
            lobby.style.display = 'block';
            game.style.display = 'none';
            messageContainer.innerText = ''; // Clear messages on game end
        }, 5000); // Adjust the time as needed
    });

    socket.on('player-lose', (data) => {
        alert(data.message);
    });

    socket.on('game-end-redirect', () => {
        lobby.style.display = 'block';
        game.style.display = 'none';
    });

    socket.on('game-update', (gameState) => {
        console.log('Game update received:', gameState);
        updateGameBoard(gameState);
    });

    socket.on('update', (data) => {
        playerList.innerHTML = '';
        data.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.innerHTML = `<img src="/player${data.players.indexOf(player) + 1}.png" class="player-icon" /> ${player.name}: Lives ${player.lives}`;
            playerList.appendChild(playerDiv);
        });
    });

    socket.on('connect', () => {
        console.log('Connected to server');
        if (sessionId) {
            const playerName = playerNameInput.value.trim() || 'Player';
            socket.emit('join', { sessionId, playerName }); // Ensure the player rejoins the session on reconnect
        }
    });

    socket.on('coin-toss-result', (result) => {
        const img = document.createElement('img');
        img.src = result === 'heads' ? '/heads.png' : '/tails.png';
        img.alt = result;
        img.className = 'coin-toss-image';
        coinTossResult.innerHTML = ''; // Clear previous result
        coinTossResult.appendChild(img);
    });

    function updateLivesDisplay(lives) {
        livesImages.innerHTML = ''; // Clear existing images
        for (let i = 0; i < 9; i++) {
            const img = document.createElement('img');
            img.src = i < lives ? '/alive.png' : '/dead.png';
            img.className = 'life-image';
            livesImages.appendChild(img);
        }
    }

    function updateGameBoard(gameState) {
        const stageGroups = {};

        // Group players by their current stage
        gameState.players.forEach((player) => {
            if (!stageGroups[player.currentStage]) {
                stageGroups[player.currentStage] = [];
            }
            stageGroups[player.currentStage].push(player);
        });

        // Position players, applying offsets if they are in the same stage
        for (const [stageId, players] of Object.entries(stageGroups)) {
            const stage = stages.find(s => s.id === parseInt(stageId, 10));
            if (stage) {
                players.forEach((player, index) => {
                    const offset = 20; // Adjust this value as needed
                    const leftPosition = stage.x + index * offset;
                    const topPosition = stage.y;

                    let piece = document.querySelector(`.piece[data-player-id="${player.id}"]`);

                    if (!piece) {
                        // Create a new piece if it doesn't exist
                        piece = document.createElement('div');
                        piece.className = 'piece';
                        piece.dataset.playerId = player.id;
                        piecesContainer.appendChild(piece);
                    }

                    // Apply transition
                    piece.style.transition = 'left 0.5s, top 0.5s';

                    // Update position
                    piece.style.left = `${leftPosition}px`;
                    piece.style.top = `${topPosition}px`;
                    piece.style.backgroundImage = `url('/player${gameState.players.indexOf(player) + 1}.png')`;
                });
            }
        }

        const currentPlayer = gameState.players.find(player => player.id === socket.id);
        if (currentPlayer) {
            updateLivesDisplay(currentPlayer.lives);
            itemsList.innerText = (currentPlayer.items || []).join(', ');

            if (currentPlayer.lives <= 0) {
                messageContainer.innerText = 'You have died and can no longer play.';
                tossButton.style.display = 'none';
                return;
            }
        }

        if (gameState.inProgress && gameState.currentTurn !== undefined) {
            const currentTurnPlayer = gameState.players.find(player => player.id === gameState.currentTurn);
            if (currentTurnPlayer && currentTurnPlayer.lives > 0 && currentTurnPlayer.id === socket.id) {
                console.log(`Current player's turn. Player ID: ${currentTurnPlayer.id}`);
                tossButton.style.display = 'block';
            } else {
                console.log(`Not this player's turn. Current turn: ${gameState.currentTurn}, Player ID: ${currentTurnPlayer ? currentTurnPlayer.id : 'undefined'}`);
                tossButton.style.display = 'none';
            }
        } else {
            tossButton.style.display = 'none';
        }
    }
});