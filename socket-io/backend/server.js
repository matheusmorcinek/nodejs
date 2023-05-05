const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = 5000;

io.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected`);

    // Listen for 'like' events from the client
    socket.on('like', ({ index, clientId }) => {
        console.log(`Card ${index} was liked by client ${clientId}`);

        // Broadcast the 'like' event to all clients except the original sender
        socket.broadcast.emit('like', { index, clientId });
    });

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});