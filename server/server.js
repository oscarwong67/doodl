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

    client.on('ready', handleReady);

    client.on('unready', handleUnready);

    client.on('leave', handleLeave);

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
    games.get(key).join(name);

    console.log("now, having the client join the room...")
    client.emit('join', name, key); //tell client that they've joined the server
}

function handleJoin(client, name, key) {
    if (games.get(key) == undefined) {   //if game key was invalid
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
    games.get(key).join(name);
    client.to(key).emit('user joined', client.id);

    client.emit('join', name, key);
}

function handleReady(name, key) {
}

function handleUnready(name, key) {
}

function handleLeave() {

}

function handleDraw() {

}

function handleMessage() {

}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);