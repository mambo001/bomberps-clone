const Bomb = require("./Bomb");

class Level {
    constructor(party) {
        this._party = party;
        this.tiles = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
            [1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
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
        this._bombs = [];
        this.players = [];
        this.nextId = 0;
    }

    get bombs() {
        return this._bombs;
    }

    explodeTile(x, y, caster) {
        for (const player of this.players) {
            if (!player.dead) {
                if (player.tileX == x && player.tileY == y) {
                    if (player.id !== caster.id) {
                        caster.score++;
                    } else {
                        caster.score--;
                    }
                    this._party.killPlayer(player);
                }
            }
        }
        // Destroy adjacent obstacles if they exists
        if (this.tiles[y][x] === 2) {
            this.setTile(x, y, 0);
        }
    }

    setTile(x, y, tile) {
        if (x < 0 || y < 0 || x > 14 || y > 12) return;

        this.tiles[y][x] = tile;
        this._party.broadcast("tile-set", {
            x: x,
            y: y,
            tile: tile
        });
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
        this._bombs.push(bomb);
        player.startBombCooldown();
        return bomb;
    }

    removeBomb(bomb) {
        for (let i = 0; i < this._bombs.length; i++) {
            if (this._bombs[i].id === bomb.id) {
                this._bombs.splice(i, 1);
            }
        }
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
        if (x < 0 || y < 0 || x > 14 || y > 12) return true;
        if (this.tiles[y][x] !== 0) return true;
        if (this.getBombsInArea(x, y, 0).length !== 0) return true;
        return false;
    }

    isTileBlockedByOtherPlayer(except, x, y) {
        for (const player of this.players) {
            if (
                !player.dead &&
                player.id !== except.id &&
                player.tileX === x &&
                player.tileY === y
            ) {
                return true;
            }
        }
        return false;
    }

    updatePlayer(delta, player) {
        if (player.dead && player.lives >= 0 && player.spawnCooldown === 0) {
            this._party.spawnPlayer(player);
            player.dead = false;
        }
        if (player.dead) return;

        // Player collision detection
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

        // if player is moving
        // let's move it
        if (player.moving) {
            let nextPos = {
                x: player.x,
                y: player.y
            };
            nextPos.tileX = Math.floor(nextPos.x);
            nextPos.tileY = Math.floor(nextPos.y);

            // Case moving up
            if (player.currentDisplacement === "up") {
                nextPos.y -= player.speed * delta;
                nextPos.tileY = Math.floor(nextPos.y);
                // Check if next tile is blocking
                console.log(
                    this.isTileBlocked(
                        player.targetTile.x,
                        player.targetTile.y
                    ),
                    ", ",
                    this.isTileBlockedByOtherPlayer(
                        player,
                        player.targetTile.x,
                        player.targetTile.y
                    )
                );
                if (
                    this.isTileBlocked(
                        player.targetTile.x,
                        player.targetTile.y
                    ) ||
                    this.isTileBlockedByOtherPlayer(
                        player,
                        player.targetTile.x,
                        player.targetTile.y
                    )
                ) {
                    // Here player can't continue to go up
                    nextPos.y = player.targetTile.y + 1 + player.size / 2;
                    player.currentDisplacement = "none";
                    player.moving = false;
                    player.isDirty = true;
                } else {
                    // Check if we went further than the target tile
                    if (nextPos.y < player.targetTile.y + player.size / 2) {
                        // Check if we are changing direction
                        if (player.targetDisplacement === "up") {
                            // If not we set target tile to upper tile
                            player.targetTile.y--;
                        } else {
                            // Else we center player on target tile
                            nextPos.y = player.targetTile.y + player.size / 2;
                            player.currentDisplacement = "none";
                            player.isDirty = true;
                        }
                    }
                }
                player.y = nextPos.y;
            }
            // Case moving down
            if (player.currentDisplacement === "down") {
                nextPos.y += player.speed * delta;
                nextPos.tileY = Math.floor(nextPos.y);
                // Check if next tile is blocking
                if (
                    this.isTileBlocked(
                        player.targetTile.x,
                        player.targetTile.y
                    ) ||
                    this.isTileBlockedByOtherPlayer(
                        player,
                        player.targetTile.x,
                        player.targetTile.y
                    )
                ) {
                    // Here player can't continue to go up
                    nextPos.y = player.targetTile.y - 1 + player.size / 2;
                    player.currentDisplacement = "none";
                    player.moving = false;
                    player.isDirty = true;
                } else {
                    // Check if we went further than the target tile
                    if (nextPos.y > player.targetTile.y + player.size / 2) {
                        if (player.targetDisplacement === "down") {
                            player.targetTile.y++;
                        } else {
                            nextPos.y = player.targetTile.y + player.size / 2;
                            player.isDirty = true;
                            player.currentDisplacement = "none";
                        }
                    }
                }
                player.y = nextPos.y;
            }
            // Case moving left
            if (player.currentDisplacement === "left") {
                nextPos.x -= player.speed * delta;
                nextPos.tileX = Math.floor(nextPos.x);
                // Check if next tile is blocking
                if (
                    this.isTileBlocked(
                        player.targetTile.x,
                        player.targetTile.y
                    ) ||
                    this.isTileBlockedByOtherPlayer(
                        player,
                        player.targetTile.x,
                        player.targetTile.y
                    )
                ) {
                    // Here player can't continue to go left
                    nextPos.x = player.targetTile.x + 1 + player.size / 2;
                    player.currentDisplacement = "none";
                    player.moving = false;
                    player.isDirty = true;
                } else {
                    // Check if we went further than the target tile
                    if (nextPos.x < player.targetTile.x + player.size / 2) {
                        if (player.targetDisplacement === "left") {
                            player.targetTile.x--;
                        } else {
                            nextPos.x = player.targetTile.x + player.size / 2;
                            player.currentDisplacement = "none";
                            player.isDirty = true;
                        }
                    }
                }
                player.x = nextPos.x;
            }
            // Case moving right
            if (player.currentDisplacement === "right") {
                nextPos.x += player.speed * delta;
                nextPos.tileX = Math.floor(nextPos.x);
                // Check if next tile is blocking
                if (
                    this.isTileBlocked(
                        player.targetTile.x,
                        player.targetTile.y
                    ) ||
                    this.isTileBlockedByOtherPlayer(
                        player,
                        player.targetTile.x,
                        player.targetTile.y
                    )
                ) {
                    // Here player can't continue to go right
                    nextPos.x = player.targetTile.x - 1 + player.size / 2;
                    player.currentDisplacement = "none";
                    player.moving = false;
                    player.isDirty = true;
                } else {
                    // Check if we went further than the target tile
                    if (nextPos.x > player.targetTile.x + player.size / 2) {
                        if (player.targetDisplacement === "right") {
                            player.targetTile.x++;
                        } else {
                            nextPos.x = player.targetTile.x + player.size / 2;
                            player.currentDisplacement = "none";
                            player.isDirty = true;
                        }
                    }
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
                player.isDirty = true;
            } else if (player.targetDisplacement === "down" && canDown) {
                player.moving = true;
                player.currentDisplacement = player.targetDisplacement;
                player.targetTile.x = player.tileX;
                player.targetTile.y = player.tileY + 1;
                player.isDirty = true;
            } else if (player.targetDisplacement === "left" && canLeft) {
                player.moving = true;
                player.currentDisplacement = player.targetDisplacement;
                player.targetTile.x = player.tileX - 1;
                player.targetTile.y = player.tileY;
                player.isDirty = true;
            } else if (player.targetDisplacement === "right" && canRight) {
                player.moving = true;
                player.currentDisplacement = player.targetDisplacement;
                player.targetTile.x = player.tileX + 1;
                player.targetTile.y = player.tileY;
                player.isDirty = true;
            } else if (player.moving === true) {
                player.moving = false;
            }
        }
    }
}

module.exports = Level;
