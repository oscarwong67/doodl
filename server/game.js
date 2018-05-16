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
    }

    join(name, id) {
        let temp = new Player(name, id);
        this.numPlayers++;
        this.players.set(temp.id, temp);
        return temp.id;
    }

    leave(id) {
        this.players.delete(id);
        this.numPlayers--;
    }
}