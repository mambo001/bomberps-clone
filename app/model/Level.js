const Bomb = require("./Bomb");

class Level {
    constructor() {
        this.tiles = [
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
        this.bonusLayer = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.bombs = [];
        this.players = [];
        this.nextId = 0;
    }

    explodeTile(x, y) {
        for (const player of this.players) {
            if (player.tileX == x && player.tileY == y) {
                // TODO : player dies
            }
        }
        // Destroy adjacent obstacles if they exists
        if (this.tiles[x][y + 1] == 2) this.setTile(x, y + 1, 0);
        if (this.tiles[x][y - 1] == 2) this.setTile(x, y - 1, 0);
        if (this.tiles[x - 1][y] == 2) this.setTile(x - 1, y, 0);
        if (this.tiles[x + 1][y] == 2) this.setTile(x + 1, y, 0);
    }

    addBomb(player) {
        if (this.getBombsInArea(player.tileX, player.tileY).length !== 0) {
            console.log("There is already a bomb in there, canceling...");
            return null;
        }
        let bomb = new Bomb(
            player,
            this.nextId++,
            player.tileX + 0.5,
            player.tileY + 0.5
        );
        this.bombs.push(bomb);
        bomb.index = this.bombs.findIndex(x => {
            return x.id === bomb.id;
        });
        player.startBombCooldown();
        return bomb;
    }

    getBombsInArea(x, y, radius) {
        let tileX = Math.floor(x);
        let tileY = Math.floor(y);
        let result = [];

        for (const bomb of this.bombs) {
            if (
                bomb.tileX <= tileX + radius &&
                bomb.tileX >= tileX - radius &&
                bomb.tileY >= tileY - radius &&
                bomb.tileY <= tileY + radius
            ) {
                result.push(bomb);
            }
        }
        return result;
    }

    isTileBlocked(x, y) {
        if (this.tiles[y][x] !== 0) return true;
        if (this.getBombsInArea(x, y, 0).length !== 0) return true;
        return false;
    }

    isTileBlockedByOtherPlayer(except, x, y) {
        for (const player of this.players) {
            if (
                player.id !== except.id &&
                player.tileX === x &&
                player.tileY === y
            )
                return true;
        }
        return false;
    }

    updatePlayer(delta, player) {
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
                        !this.isTileBlocked(
                            player.targetTile.x,
                            player.targetTile.y
                        ) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            player.targetTile.x,
                            player.targetTile.y
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
                        }
                    } else {
                        nextPos.y = player.targetTile.y + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                    }
                    player.y = nextPos.y;
                }
                if (player.currentDisplacement === "down") {
                    nextPos.y += player.speed * delta;
                    nextPos.tileY = Math.floor(nextPos.y);
                    if (
                        !this.isTileBlocked(
                            player.targetTile.x,
                            player.targetTile.y
                        ) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            player.targetTile.x,
                            player.targetTile.y
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
                        }
                    } else {
                        nextPos.y = player.targetTile.y + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                    }
                    player.y = nextPos.y;
                }
                if (player.currentDisplacement === "left") {
                    nextPos.x -= player.speed * delta;
                    nextPos.tileX = Math.floor(nextPos.x);

                    if (
                        !this.isTileBlocked(
                            player.targetTile.x,
                            player.targetTile.y
                        ) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            player.targetTile.x,
                            player.targetTile.y
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
                        }
                    } else {
                        // Uptile is blocking
                        nextPos.x = player.targetTile.x + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
                    }
                    player.x = nextPos.x;
                }
                if (player.currentDisplacement === "right") {
                    nextPos.x += player.speed * delta;
                    nextPos.tileX = Math.floor(nextPos.x);

                    if (
                        !this.isTileBlocked(
                            player.targetTile.x,
                            player.targetTile.y
                        ) &&
                        !this.isTileBlockedByOtherPlayer(
                            player,
                            player.targetTile.x,
                            player.targetTile.y
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
                        }
                    } else {
                        // Uptile is blocking
                        nextPos.x = player.targetTile.x + 0.5;
                        player.currentDisplacement = "none";
                        player.moving = false;
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
}

module.exports = Level;
