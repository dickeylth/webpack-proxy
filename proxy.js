const http = require('http');
const sockjs = require('sockjs');
const express = require('express');
const app = express();
const server = http.createServer(app);
const WebSocket = require('ws');
app.get('/', (req, res) => {
  res.send('Hello Proxy');
});

const echo = sockjs.createServer();
echo.on('connection', function(conn) {
  conn.on('data', dataStr => {
    console.log(`data`, dataStr);
    try {
      let data = JSON.parse(dataStr);
      if (data.type === 'connect') {
        const wsClient = new WebSocket(...data.args);
        wsClient.addEventListener('open', () => {
          console.log('wsClient open');
        });
        wsClient.addEventListener('message', msg => {
          conn.write(msg.data);
        });
      }
    } catch (e) {}
  });
  conn.on('close', function() {});
});

echo.installHandlers(server);
server.listen(9876, () => {
  console.log('Listening on http://localhost:9876');
});