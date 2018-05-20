function Player(name, id) {
    this.name = name;
    this.id = id;
    this.ready = false;
    this.drawing = false;
    this.score = 0;
}

module.exports = class Game {
    constructor(key) {
        this.key = key;
        this.numPlayers = 0;
        this.players = new Map();
        this.playerArray = [];
        this.allReady = false;
        this.started = false;
        this.rounds = 2;
        this.currentRound = 1;
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
    startPlayer(playerIndex) {   //runs once for each player in each round
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

    
}