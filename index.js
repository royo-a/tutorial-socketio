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
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// GET '/'
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// 👉 Every time the socket client connects to the socket server
// a connection event is fired. This code will run every time a
// new browser window is opened.
io.on('connection', socket => {
  console.log('a user connected');

  socket.on('chat message', msg => {
    console.log('Message: ' + msg);
  });

  socket.on('disconnect', () => {
    // 👉 This code will run for every browser window close
    // because the socket client disconnects with the socket server.
    console.log('a user disconnected');
  });
});

// Server connects to port 3000 of localhost
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
