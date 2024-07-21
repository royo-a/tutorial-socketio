import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// The server side of socket io
import { Server } from 'socket.io';

const app = express();
// Node server
const server = createServer(app);
// Socket server (io) mounts of top of node server
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(server);

// Server connects to port 3000 of localhost
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

// GET '/'
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// 👉 Every time the socket client connects to the socket server
// a connection event is fired. This code will run every time a
// new browser window is opened.
io.on('connection', socket => {
  console.log('a user connected');

  // 👉 Emit to all other clients except the client who
  // sent the message.
  // socket.broadcast.emit('chat message', msg);

  socket.on('test emit', msg => {
    console.log(msg);
    // Emit only to the client who sent the event
    socket.emit('test emit back', 'this is an emit from the server');
  });

  socket.on('chat message', msg => {
    // 👉 Emit the message to all clients, including
    // the one who generated the message.
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    // 👉 This code will run for every browser window close
    // because the socket client disconnects with the socket server.
    console.log('a user disconnected');
  });

  // Send acknowledgement through callback
  socket.on('emit for ack', (msg, callback) => {
    console.log(msg);
    callback(null, { status: 'ok' });
  });
});
