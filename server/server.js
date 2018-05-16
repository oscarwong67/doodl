const io = require('socket.io')();
const randomString = require('random-base64-string');
const Game = require('./game.js');

let games = new Map();

io.on('connection', (client) => {
    client.on('create', (name) => {
        handleCreate(client, name);
    });

    client.on('join', (name, key) => {
        handleJoin(client, name, key);
    });

    client.on('leave', (id, name, key) => {
        handleLeave(client, id, name, key);
    });

    /*client.on('disconnect', () => {
        client.emit('selfLeave', client);   //at this point, we have the ID of the client but not which room it left
    });*/

    client.on('ready', handleReady);

    client.on('unready', handleUnready);

    client.on('draw', handleDraw);

    client.on('message', handleMessage);
});

function handleCreate(client, name) {
    console.log(name + " is creating a lobby");
    //generate a unique key
    let key = randomString(12);
    while (typeof games.get(key) == undefined) {
        key = randomString(12);
    }
    console.log("new game created! key: " + key);

    //join the room, and also update the Map() object of games
    games.set(key, new Game(key));
    client.join(key, () => {
        let rooms = Object.keys(client.rooms);
        console.log(rooms); //prints out all rooms that the client is in - first element is the client's ID.
    });
    games.get(key).join(name, client.id);

    console.log("now, having the client join the room...");
    
    client.emit('selfJoin', client.id, name, key, games.get(key).playerNames); //tell client they've joined
    io.sockets.in(key).emit('join', name, key, games.get(key).playerNames); //tell everyone they've joined
}

function handleJoin(client, name, key) {
    if (! games.get(key)) {   //if game key was invalid
        client.emit('err', "invalid key");
        return;
    } else if (games.get(key).numPlayers >= 10) {  //if game is full
        client.emit('err', "full game");
        return;
    }

    //join the room, and also update the Map() object of games
    client.join(key, () => {
        let rooms = Object.keys(client.rooms);
        console.log(rooms); //prints out all rooms that the client is in - first element is the client's ID.
    });
    games.get(key).join(name, client.id);

    client.emit('selfJoin', client.id, name, key, games.get(key).playerNames); //tell client they've joined
    io.sockets.in(key).emit('join', name, key, games.get(key).playerNames); //tell everyone they've joined
}

function handleLeave(client, id, name, key) {    
    if (games.get(key)) {
        client.leave(key);  //leave the room
        games.get(key).leave(name, id);  //remove player from games object
        if (games.get(key).numPlayers == 0) { //if no players remaining, delete room from list of games
            games.delete(key);
            return;
        }
        console.log("User " + client.id + " has left room " + key);
        io.sockets.in(key).emit('leave', name, key, games.get(key).playerNames);    //tell everyone client has left
    }

}

function handleReady(name, key) {
}

function handleUnready(name, key) {
}

function handleDraw() {

}

function handleMessage() {

}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);