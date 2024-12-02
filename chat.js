const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static('public')); // Serve static files from the 'public' directory
let contatore = 0;
io.on('connection', (socket) => {
    contatore++;
    io.emit('welcome', "ciao bello! siete in " + contatore); //broadcast message to all connected clients
    //console.log('A user connected!');
    socket.on('chat message', msg => {
        io.emit('chat message', msg); // Broadcast message to all connected clients});
    });
});
io.on('disconnect', () => {
    contatore--;
    io.emit('welcome', "ciao bello! siete in " + contatore); //broadcast message to all connected clients
    //console.log('A user disconnected!');
});

http.listen(3000, () => {
    console.log('Server listening on port 3000');
});