const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

// Middleware for JSON parsing
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Socket.io service is running');
});

// Broadcast endpoint for PHP backend
app.post('/broadcast', (req, res) => {
  const { event, data } = req.body;
  
  console.log('[SOCKET.IO] Broadcasting event:', event, 'data:', data);
  
  // Broadcast to all connected clients
  io.emit(event, data);
  
  res.json({ success: true, clients: io.engine.clientsCount });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('[SOCKET.IO] Client connected. Total clients:', io.engine.clientsCount);
  
  socket.on('disconnect', () => {
    console.log('[SOCKET.IO] Client disconnected. Total clients:', io.engine.clientsCount);
  });
  
  // Send welcome message
  socket.emit('connected', {
    message: 'Connected to Socket.io server',
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[SOCKET.IO] Server listening on port', PORT);
});
