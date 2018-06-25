function Player(name, id) {
    this.name = name;
    this.id = id;
    this.ready = false;
    this.drawing = false;
    this.points = 0;
}

const DrawInterval = require('./drawInterval.js');

module.exports = class Game {
    constructor(key) {
        this.key = key;
        this.numPlayers = 0;
        this.guessedPlayers = 0; //number of players who've guessed
        this.players = new Map();
        this.playerArray = [];
        this.allReady = false;
        this.started = false;
        this.rounds = 2;
        this.currentRound = 1;
        this.currentPlayer = 0; //index of current drawing player
        this.word = "";
        this.drawIntervalObj = {};
    }
    setRounds(rounds) {
        this.rounds = rounds;
    }
    getIndex(name) {
        let index = this.playerArray.map((player) => {
            return player.name;
        }).indexOf(name);
        return index;
    }
    join(name, id) {
        let temp = new Player(name, id);
        this.numPlayers++;
        this.players.set(temp.id, temp);
        this.playerArray.push(temp);
        return temp.id;
    }
    leave(name, id) {
        let index = this.getIndex(name);
        this.players.delete(id);
        this.playerArray.splice(index, 1);
        this.numPlayers--;
    }
    toggleReady(name, id) {
        let index = this.getIndex(name);
        if (this.players.get(id).ready) {
            this.players.get(id).ready = false;
            this.playerArray[index].ready = false;
        } else {
            this.players.get(id).ready = true;
            this.playerArray[index].ready = true;
        }
        this.allReady = true;
        this.playerArray.map((player) => {
            if (! player.ready) {
                this.allReady = false;
            }
        });
    }
    startDrawing(name, id) {
        let index = this.getIndex(name);
        this.players.get(id).drawing = true;
        this.playerArray[index].drawing = true;
    }
    stopDrawing(name, id) {

    }
    startGame() {
        this.started = true;
    }
    setTimer(key, io, games, handleStartPlayer) {
        this.drawIntervalObj = new DrawInterval(key, io, games, handleStartPlayer, this.currentRound);
    }
    clearTimer() {
        this.drawIntervalObj.clear();
    }
    startPlayer(playerIndex) {   //runs once for each player in each round
        if (playerIndex < 0 || playerIndex > (this.numPlayers - 1)) {
            return;
        }
        this.currentPlayer = playerIndex;
        this.guessedPlayers = 0; //0 players have guessed every time a new one starts
        for (let i = 0; i < this.playerArray.length; i++) {
            this.playerArray[i].drawing = false;
            this.players.get(this.playerArray[i].id).drawing = false;
        }
        let id = this.playerArray[playerIndex].id;
        this.playerArray[playerIndex].drawing = true;
        this.players.get(id).drawing = true;
    }
    startRound(round) {
        this.currentRound = round;
    }
    setWord(word) {
        this.word = word;
    }
    successGuess() {
        this.guessedPlayers++;
    }
    addPoints(name, id, points) {
        let index = this.getIndex(name);
        this.players.get(id).points += points;
        this.playerArray[index].points += points;
    }
    addDrawerPoints(index, points) {
        let id = this.playerArray[index].id;
        this.players.get(id).points += points;
        this.playerArray[index].points += points;
    }    
}