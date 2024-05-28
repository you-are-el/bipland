const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { games } = require('../utils/gameUtils');

router.get('/host', (req, res) => {
    const sessionId = uuidv4();
    games[sessionId] = { players: [], inProgress: false, currentTurn: 0 };
    console.log(`New game hosted with session ID: ${sessionId}`);
    res.json({ sessionId });
});

router.get('/game/:id', (req, res) => {
    const sessionId = req.params.id;
    if (games[sessionId]) {
        console.log(`Joining game with session ID: ${sessionId}`);
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
        console.log(`Game not found with session ID: ${sessionId}`);
        res.status(404).send('Game not found');
    }
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = router;