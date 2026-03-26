console.log('Starting simple TCP server...');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const net = require('net');

console.log('Creating TCP server...');

const server = net.createServer((socket) => {
  console.log('TCP connection received');
  socket.write('Hello World\n');
  socket.end();
  console.log('TCP response sent');
});

console.log('About to listen on TCP...');

server.listen(3002, () => {
  console.log('TCP Server listening on port 3002');
  console.log('TCP Server setup complete');
});

server.on('error', (err) => {
  console.error('TCP Server error:', err);
});

console.log('Script end reached');

// Force keep event loop alive
setInterval(() => {
  // Keep alive
}, 1000);

console.log('Event loop keeper started');