const Player = require("./Player");
const process = require("process");

const MAX_PARTY_SIZE = 4;

const hrtimeMs = function() {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
};
class Party {
    constructor(id) {
        this._id = id;
        this._players = [];
        this.lastUpdateTime = hrtimeMs;
        this._handle = setInterval(() => this.update(), 1000 / 60);

        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    get id() {
        return this._id;
    }

    get size() {
        return this._players.length;
    }

    update() {
        var currentTime = hrtimeMs();
        var delta = (currentTime - this.lastUpdateTime) / 1000;

        for (const player of this._players) {
            this._updatePlayer(delta, player);
            if (player.isDirty) {
                this.broadcast("player-update", {
                    id: player.id,
                    pos: player.position
                });
            }
        }

        this.lastUpdateTime = currentTime;
    }

    isTileBlocked(x, y) {
        if (this.map[y][x] !== 0) return true;
        return false;
    }

    isTileBlockedByOtherPlayer(except, x, y) {
        for (const player of this._players) {
            if (
                player.id !== except.id &&
                player.tileX === x &&
                player.tileY === y
            )
                return true;
        }
        return false;
    }

    _updatePlayer(delta, player) {
        if (player.moving.length == 0) {
            player.isDirty = false;
        } else {
            let canUp =
                !this.isTileBlocked(player.tileX, player.tileY - 1) &&
                !this.isTileBlockedByOtherPlayer(
                    player,
                    player.tileX,
                    player.tileY - 1
                );
            let canDown =
                !this.isTileBlocked(player.tileX, player.tileY + 1) &&
                !this.isTileBlockedByOtherPlayer(
                    player,
                    player.tileX,
                    player.tileY + 1
                );
            let canLeft =
                !this.isTileBlocked(player.tileX - 1, player.tileY) &&
                !this.isTileBlockedByOtherPlayer(
                    player,
                    player.tileX - 1,
                    player.tileY
                );
            let canRight =
                !this.isTileBlocked(player.tileX + 1, player.tileY) &&
                !this.isTileBlockedByOtherPlayer(
                    player,
                    player.tileX + 1,
                    player.tileY
                );

            if (player.moving) {
                let nextPos = {
                    x: player.x,
                    y: player.y
                };
                nextPos.tileX = Math.floor(nextPos.x);
                nextPos.tileY = Math.floor(nextPos.y);

                if (player.currentDisplacement === "up") {
                    nextPos.y -= player.speed * delta;
                    nextPos.tileY = Math.floor(nextPos.y);
                    // Check if tile is blocking
                    if (
                        !this.isTileBlocked(nextPos.tileX, nextPos.tileY) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            nextPos.tileX,
                            nextPos.tileY
                        )
                    ) {
                        // Test if next displacement is changing direction
                        // In that case we want to finish diplacement from one tile
                        if (nextPos.y < player.targetTile.y + 0.5) {
                            if (player.targetDisplacement !== "up") {
                                nextPos.y =
                                    player.targetTile.y + player.size / 2;
                            }
                            player.currentDisplacement = "none";
                            player.moving = false;
                            console.log("Displacement ended (reached dest)");
                        }
                    } else {
                        nextPos.y = player.targetTile.y + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                        console.log("Displacement ended (wall)");
                    }
                    player.y = nextPos.y;
                }
                if (player.currentDisplacement === "down") {
                    nextPos.y += player.speed * delta;
                    nextPos.tileY = Math.floor(nextPos.y);
                    if (
                        !this.isTileBlocked(nextPos.tileX, nextPos.tileY) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            nextPos.tileX,
                            nextPos.tileY
                        )
                    ) {
                        // Test if next displacement is changing direction
                        // In that case we want to finish diplacement from one tile
                        if (nextPos.y > player.targetTile.y + 0.5) {
                            if (player.targetDisplacement !== "down") {
                                nextPos.y =
                                    player.targetTile.y + player.size / 2;
                            }
                            player.currentDisplacement = "none";
                            player.moving = false;
                            console.log("Displacement ended (reached dest)");
                        }
                    } else {
                        nextPos.y = player.targetTile.y + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                        console.log("Displacement ended (wall)");
                    }
                    player.y = nextPos.y;
                }
                if (player.currentDisplacement === "left") {
                    nextPos.x -= player.speed * delta;
                    nextPos.tileX = Math.floor(nextPos.x);

                    if (
                        !this.isTileBlocked(nextPos.tileX, nextPos.tileY) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            nextPos.tileX,
                            nextPos.tileY
                        )
                    ) {
                        // Test if next displacement is changing direction
                        // In that case we want to finish diplacement from one tile
                        if (nextPos.x < player.targetTile.x + 0.5) {
                            if (player.targetDisplacement !== "left") {
                                nextPos.x =
                                    player.targetTile.x + player.size / 2;
                            }
                            player.currentDisplacement = "none";
                            player.moving = false;
                            console.log("Displacement ended (reached dest)");
                        }
                    } else {
                        // Uptile is blocking
                        nextPos.x = player.targetTile.x + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                        console.log("Displacement ended (wall)");
                    }
                    player.x = nextPos.x;
                }
                if (player.currentDisplacement === "right") {
                    nextPos.x += player.speed * delta;
                    nextPos.tileX = Math.floor(nextPos.x);

                    if (
                        !this.isTileBlocked(nextPos.tileX, nextPos.tileY) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            nextPos.tileX,
                            nextPos.tileY
                        )
                    ) {
                        // Test if next displacement is changing direction
                        // In that case we want to finish diplacement from one tile
                        if (nextPos.x > player.targetTile.x + 0.5) {
                            if (player.targetDisplacement !== "right") {
                                nextPos.x =
                                    player.targetTile.x + player.size / 2;
                            }
                            player.currentDisplacement = "none";
                            player.moving = false;
                            console.log("Displacement ended (reached dest)");
                        }
                    } else {
                        // Uptile is blocking
                        nextPos.x = player.targetTile.x + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                        console.log("Displacement ended (wall)");
                    }
                    player.x = nextPos.x;
                }
            }

            if (player.currentDisplacement === "none") {
                if (player.targetDisplacement === "up" && canUp) {
                    player.moving = true;
                    player.currentDisplacement = player.targetDisplacement;
                    player.targetTile.x = player.tileX;
                    player.targetTile.y = player.tileY - 1;
                    console.log(
                        "Player starting to move up (target y=%i)",
                        player.targetTile.y
                    );
                } else if (player.targetDisplacement === "down" && canDown) {
                    player.moving = true;
                    player.currentDisplacement = player.targetDisplacement;
                    player.targetTile.x = player.tileX;
                    player.targetTile.y = player.tileY + 1;
                } else if (player.targetDisplacement === "left" && canLeft) {
                    player.moving = true;
                    player.currentDisplacement = player.targetDisplacement;
                    player.targetTile.x = player.tileX - 1;
                    player.targetTile.y = player.tileY;
                } else if (player.targetDisplacement === "right" && canRight) {
                    player.moving = true;
                    player.currentDisplacement = player.targetDisplacement;
                    player.targetTile.x = player.tileX + 1;
                    player.targetTile.y = player.tileY;
                } else {
                    player.moving = false;
                }
            }

            player.isDirty = true;
        }
    }

    getTileAtPos(pos) {
        return this.map[Math.floor(pos.y)][Math.floor(pos.x)];
    }

    broadcast(eventName, arg) {
        for (var i = 0; i < this._players.length; i++) {
            this._players[i].socket.emit(eventName, arg);
        }
    }

    addPlayer(socket) {
        if (this.size >= MAX_PARTY_SIZE) {
            console.log("This party is full");
            return;
        }
        let player = new Player(socket);
        for (const p of this._players) {
            player.socket.emit("player-add", {
                id: p.id,
                pos: p.position
            });
        }
        this._players.push(player);
        return player;
    }

    removePlayer(socket) {
        let index = this._players.findIndex(x => x.socket.id == socket.id);
        if (index != -1) {
            console.log(
                "Player %s is leaving the party.",
                this._players[index].id
            );
            this.broadcast("player-remove", {
                id: this._players[index].id
            });
            this._players[index].unsubscribe();
            this._players.splice(index, 1);
        }
    }

    dispose() {
        clearInterval(this._handle);
    }
}

module.exports = Party;
