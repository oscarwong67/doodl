import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

let client = {
    id: '',
    name: '',
    gameKey: ''
}

let players = [];

function handleError(error) {
    console.log("whoa, an error! error: " + error);
}

function createLobby(name) {
    //listen for players joining, and errors
    console.log("creating a lobby...");
    socket.on('selfJoin', selfJoin);
    socket.on('err', handleError);
    socket.emit('create', name);    //send call to server to create room
}

function joinLobby(name, key) { //call this function when a user clicks the "join game" button
    console.log("attempting to join lobby " + key);    
    //listen for players joining, and errors
    socket.on('selfJoin', selfJoin);
    socket.on('err', handleError);    
    socket.emit('join', name, key); //send call to server to join room    
}

function selfJoin(clientID, name, key) {  //called when the client themselves joins a room
    client.id = clientID;
    client.name = name;
    client.gameKey = key;
    console.log("You, " + name + " have joined room " + key);
    socket.on('join', handleJoin);  //listen for other people joining
    socket.on('leave', handleLeave); //listen for other people leaving
}

function handleJoin(name, key) {    //called when anyone successfully joins your current room
    //onPlayerJoin - update react stuff so a player "visually" joins    
    console.log(name + " has joined room " + key);
    players.push(name);
}

function selfLeave(clientID, name, key) {
    socket.emit('leave', clientID, name, key);
}

window.onbeforeunload = function(){
    selfLeave(client.id, client.name, client.gameKey);  //called before the user disconnects
};

function handleLeave(name, key) {
    console.log(name + " has left room " + key);
}

function ready(name) {
}

function handleReady() {

}

function unready() {

}

function handleUnready() {

}

function handleStart() {

}

function message(name, key, message) {
    socket.emit('message', name, key, message);
}

export {createLobby, joinLobby, handleJoin}