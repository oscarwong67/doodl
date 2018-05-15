import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

let gameKey = '';

function handleError(error) {
    console.log("whoa, an error! error: " + error);
}

function createLobby(name) {
    //listen for players joining, and errors
    console.log("creating a lobby...");
    socket.on('join', handleJoin);
    socket.on('err', handleError);
    socket.emit('create', name);    //send call to server to create room
}

function joinLobby(name, key) { //call this function when a user clicks the "join game" button
    console.log("attempting to join lobby " + key);
    gameKey = key;
    //listen for players joining, and errors
    socket.on('join', handleJoin);
    socket.on('err', handleError);    
    socket.emit('join', name, key); //send call to server to join room
}

function handleJoin(name, key) {
    //onPlayerJoin - update react stuff so a player "visually" joins
    console.log(name + " has joined room " + key);
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

function leave (name, key) {
    socket.emit('leave', name, key);
}

function message(name, key, message) {
    socket.emit('message', name, key, message);
}

export {createLobby, joinLobby}