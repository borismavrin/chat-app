const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
   generateMessage
} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
   console.log('New user connected');

   //  socket.emit('newEmail', {
   //     from: 'mike@example.com',
   //     text: 'Hey. What is going on.',
   //     createdAt: 123
   //  });
   //
   //  socket.on('createEmail', (newEmail) => {
   //     console.log('createEmail', newEmail);
   //  });

   socket.on('disconnect', () => {
      console.log('User was disconnected');
   });

   socket.on('createMessage', (message, callback) => {
      console.log('createMessage', message);
      io.emit('newMessage', generateMessage(message.from,message.text));
      callback({text:"ddd"});
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // });
   });
   socket.emit('newMessage', generateMessage("Admin", "welcome to chat"));
   socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined"));

});
server.listen(port, () => {
   console.log(`Server is up on ${port}`);
});
