const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use(gameRoutes);

// Socket.io handlers
const gameSocket = require('./socket/gameSocket');
io.on('connection', (socket) => {
    gameSocket(io, socket);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));