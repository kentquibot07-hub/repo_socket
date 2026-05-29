# Brewery Socket.io Service

Socket.io service for real-time order updates.

## Setup

1. Create a new GitHub repository for this service
2. Push this folder to the new repository
3. Deploy on Railway from the new repository

## Railway Deployment

1. Go to Railway dashboard → New Project → Deploy from GitHub
2. Select the new repository
3. Railway will auto-detect Node.js
4. No environment variables needed

## API Endpoints

### Health Check
- `GET /health` - Returns "Socket.io service is running"

### Broadcast (for PHP backend)
- `POST /broadcast` - Broadcast message to all connected clients
- Body: `{ "type": "new_order", "data": { ... } }`

## Socket.io Events

### Client → Server
- Connection established automatically

### Server → Client
- `connected` - Welcome message on connection
- `new_order` - New order received
- `order_update` - Order status updated

## Usage

### PHP Backend
```php
// Send broadcast to Socket.io service
curl -X POST https://socketio-service-url/broadcast \
  -H "Content-Type: application/json" \
  -d '{"type":"new_order","data":{"orderNumber":"1234"}}'
```

### Frontend (JavaScript)
```javascript
const socket = io('https://socketio-service-url');

socket.on('new_order', (data) => {
  console.log('New order:', data);
  // Handle new order
});

socket.on('order_update', (data) => {
  console.log('Order updated:', data);
  // Handle order update
});
```

### Frontend (React Native)
```javascript
import io from 'socket.io-client';

const socket = io('https://socketio-service-url');

socket.on('new_order', (data) => {
  console.log('New order:', data);
  // Handle new order
});

socket.on('order_update', (data) => {
  console.log('Order updated:', data);
  // Handle order update
});
```
