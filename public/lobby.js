const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const hostButton = document.getElementById('host-game');
    const joinButton = document.getElementById('join-game');
    const sessionIdInput = document.getElementById('session-id');
    const controls = document.getElementById('controls');
    const playersList = document.getElementById('players-list');
    const sessionInfo = document.getElementById('session-info');
    const sessionIdDisplay = document.getElementById('session-id-display');
    const copyButton = document.getElementById('copy-session-id');
    const startButton = document.getElementById('start-game');

    let currentSessionId;

    hostButton.addEventListener('click', () => {
        console.log('Host Game button clicked');
        fetch('/host')
            .then(response => response.json())
            .then(data => {
                console.log(`Hosted game with session ID: ${data.sessionId}`);
                joinSession(data.sessionId);
            })
            .catch(error => console.error('Error hosting game:', error));
    });

    joinButton.addEventListener('click', () => {
        const sessionId = sessionIdInput.value;
        if (sessionId) {
            console.log(`Join Game button clicked with session ID: ${sessionId}`);
            joinSession(sessionId);
        } else {
            console.log('No session ID provided');
        }
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(sessionIdDisplay.textContent)
            .then(() => console.log('Session ID copied to clipboard'))
            .catch(err => console.error('Error copying text: ', err));
    });

    startButton.addEventListener('click', () => {
        console.log(`Starting game with session ID: ${currentSessionId}`);
        socket.emit('start-game', currentSessionId);
    });

    function joinSession(sessionId) {
        currentSessionId = sessionId;
        socket.emit('join', sessionId);
        controls.style.display = 'none';
        sessionInfo.style.display = 'block';
        sessionIdDisplay.textContent = sessionId;
    }

    socket.on('update', (gameState) => {
        console.log('Update received:', gameState);
        updatePlayersList(gameState.players);
    });

    socket.on('game-start', (sessionId) => {
        window.location.href = `/game/${sessionId}`;
    });

    function updatePlayersList(players) {
        playersList.innerHTML = '';
        players.forEach((player, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Player ${index + 1}`;
            playersList.appendChild(listItem);
        });
    }
});