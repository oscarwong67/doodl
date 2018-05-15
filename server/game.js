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

    join(name) {
        let temp = new Player(name, this.numPlayers);
        this.numPlayers++;
        this.players.set(temp.id, temp);
        return temp.id;
    }
}