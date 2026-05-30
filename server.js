const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true
});

const PORT = process.env.PORT || 8080;

// Middleware for JSON parsing
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log('[SOCKET.IO] Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('[SOCKET.IO] Health check requested');
  res.send('Socket.io service is running');
});

// Broadcast endpoint for PHP backend
app.post('/broadcast', (req, res) => {
  const { event, data } = req.body;
  
  console.log('[SOCKET.IO] ===== BROADCAST REQUEST =====');
  console.log('[SOCKET.IO] Event:', event);
  console.log('[SOCKET.IO] Data:', JSON.stringify(data, null, 2));
  console.log('[SOCKET.IO] Connected clients before broadcast:', io.engine.clientsCount);
  
  // Broadcast to all connected clients
  io.emit(event, data);
  
  console.log('[SOCKET.IO] Broadcast sent to all clients');
  console.log('[SOCKET.IO] ===== END BROADCAST =====');
  
  res.json({ success: true, clients: io.engine.clientsCount });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('[SOCKET.IO] ===== CLIENT CONNECTED =====');
  console.log('[SOCKET.IO] Socket ID:', socket.id);
  console.log('[SOCKET.IO] Client IP:', socket.handshake.address);
  console.log('[SOCKET.IO] Total connected clients:', io.engine.clientsCount);
  console.log('[SOCKET.IO] ===== END CONNECTION =====');
  
  socket.on('disconnect', () => {
    console.log('[SOCKET.IO] ===== CLIENT DISCONNECTED =====');
    console.log('[SOCKET.IO] Socket ID:', socket.id);
    console.log('[SOCKET.IO] Total connected clients:', io.engine.clientsCount);
    console.log('[SOCKET.IO] ===== END DISCONNECT =====');
  });
  
  socket.on('error', (error) => {
    console.error('[SOCKET.IO] ===== SOCKET ERROR =====');
    console.error('[SOCKET.IO] Socket ID:', socket.id);
    console.error('[SOCKET.IO] Error:', error);
    console.error('[SOCKET.IO] ===== END ERROR =====');
  });
  
  // Log all events from client
  socket.onAny((eventName, ...args) => {
    console.log('[SOCKET.IO] ===== EVENT FROM CLIENT =====');
    console.log('[SOCKET.IO] Socket ID:', socket.id);
    console.log('[SOCKET.IO] Event:', eventName);
    console.log('[SOCKET.IO] Args:', JSON.stringify(args, null, 2));
    console.log('[SOCKET.IO] ===== END EVENT =====');
  });
  
  // Send welcome message
  const welcomeData = {
    message: 'Connected to Socket.io server',
    timestamp: new Date().toISOString(),
    socketId: socket.id
  };
  console.log('[SOCKET.IO] Sending welcome message:', welcomeData);
  socket.emit('connected', welcomeData);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[SOCKET.IO] ===== SERVER STARTED =====');
  console.log('[SOCKET.IO] Listening on port:', PORT);
  console.log('[SOCKET.IO] Host: 0.0.0.0');
  console.log('[SOCKET.IO] ===== END START =====');
});
