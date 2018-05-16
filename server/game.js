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
        this.playerNames = [];
    }

    join(name, id) {
        let temp = new Player(name, id);
        this.numPlayers++;
        this.players.set(temp.id, temp);
        this.playerNames.push(temp.name);
        return temp.id;
    }

    leave(name, id) {
        let index = this.playerNames.indexOf(name);
        this.players.delete(id);
        this.playerNames.splice(index, 1);
        this.numPlayers--;
    }
}