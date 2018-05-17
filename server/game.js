function Player(name, id) {
    this.name = name;
    this.id = id;
    this.ready = false;
}

module.exports = class Game {
    constructor(key) {
        this.key = key;
        this.numPlayers = 0;
        this.players = new Map();
        this.playerArray = [];
        this.allReady = false;
        this.started = false;
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

    startGame() {
        this.started = true;
    }
}