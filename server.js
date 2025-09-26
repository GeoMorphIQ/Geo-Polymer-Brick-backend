// server.js (Corrected version)
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws'); // Use the 'ws' library

const app = express();
const server = http.createServer(app);

// Use Render's dynamic port or a default
const PORT = process.env.PORT || 3000;

// Set up the WebSocket Server
const wss = new WebSocketServer({ server });

// Function to broadcast a message to all connected clients
function broadcast(data) {
    console.log("Broadcasting:", data);
    wss.clients.forEach(client => {
        // Check if the client's connection is open
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    // When a message is received (from the ESP32)
    ws.on('message', (message) => {
        console.log('Received from ESP32:', message.toString());
        // Broadcast the received message to all clients (including the browser)
        broadcast(message.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
