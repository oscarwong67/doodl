module.exports = class drawIntervalClass {
    constructor(key, io, games, handleStartPlayer, round) {
        this.drawInterval = undefined;
        let time = 0;
        this.drawInterval = setTimeout(function setDrawInterval() {
            if (games.get(key)) {
                if (time < 85 && games.get(key).guessedPlayers !== (games.get(key).numPlayers) - 1) {
                    time++;
                    io.sockets.in(key).emit('interval', 85 - time);
                    setTimeout(setDrawInterval, 1000);
                } else {
                    /*if (games.get(key)) {
                        if (games.get(key).currentPlayer < (games.get(key).numPlayers - 1)) {
                            handleStartPlayer(games.get(key).currentPlayer + 1, key);
                            setTimeout(setDrawInterval, 1000);
                        } else {
                            io.sockets.in(key).emit('startRound', round + 1);
                        }
                    }*/
                    clearTimeout(this.drawInterval);
                }
            } else {
                clearTimeout(this.drawInterval);
            }
        }, 1000);
    }

    clear() {
        clearTimeout(this.drawInterval);
    }
}