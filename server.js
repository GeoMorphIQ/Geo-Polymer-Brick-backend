const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080; // Render assigns a port dynamically

const wss = new WebSocket.Server({ server });

// Serve frontend only if needed (optional)
// app.use(express.static(path.join(__dirname, "../frontend")));

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      // Broadcast to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      console.error("Invalid JSON received");
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
