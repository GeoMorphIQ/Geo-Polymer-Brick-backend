// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Use Render's dynamic port
const PORT = process.env.PORT || 3000;

// Serve static files if needed (optional)
app.use(express.static('public'));

// Socket.IO
const io = new Server(server, {
  path: '/', // ESP32 will connect to "/"
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // If you want, you can emit messages to browser clients:
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Accept incoming messages from ESP32 and broadcast to all clients
io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      io.emit('sensorData', data); // broadcast to all
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
