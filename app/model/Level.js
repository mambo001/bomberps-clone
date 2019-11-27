const Bomb = require("./Bomb");
const Constants = require("../engine/Constants");

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

    playerCanGo(player, x, y) {
        return (
            !this.isTileBlocked(x, y) &&
            !this.isTileBlockedByOtherPlayer(player, x, y)
        );
    }

    updatePlayer(delta, player) {
        if (player.dead && player.lives >= 0 && player.spawnCooldown === 0) {
            this._party.spawnPlayer(player);
            player.dead = false;
        }
        if (player.dead) return;

        // Player collision detection
        let canGo = [
            this.playerCanGo(player, player.tileX, player.tileY - 1), // 0 = up
            this.playerCanGo(player, player.tileX, player.tileY + 1), // 1 = down
            this.playerCanGo(player, player.tileX - 1, player.tileY), // 2 = left
            this.playerCanGo(player, player.tileX + 1, player.tileY) // 3 = right
        ];

        // if player is moving
        // let's move it
        let nextPos = {
            x: player.x,
            y: player.y
        };

        nextPos.x += player.speed * delta * player.xDirection;
        nextPos.y += player.speed * delta * player.yDirection;

        nextPos.tileX = Math.floor(nextPos.x);
        nextPos.tileY = Math.floor(nextPos.y);

        if (!player.moving) {
            if (player.targetDisplacement === "up" && canGo[0]) {
                player.setLockedTile(player.tileX, player.tileY - 1);
                player.isDirty = true;
                player.moving = true;
            } else if (player.targetDisplacement === "down" && canGo[1]) {
                player.setLockedTile(player.tileX, player.tileY + 1);
                player.isDirty = true;
                player.moving = true;
            } else if (player.targetDisplacement === "left" && canGo[2]) {
                player.setLockedTile(player.tileX - 1, player.tileY);
                player.isDirty = true;
                player.moving = true;
            } else if (player.targetDisplacement === "right" && canGo[3]) {
                player.setLockedTile(player.tileX + 1, player.tileY);
                player.isDirty = true;
                player.moving = true;
            }
            player.currentDisplacement = player.targetDisplacement;
        } else {
            let displacementDone = false;
            if (player.currentDisplacement === "up") {
                if (player.y < player.lockedTileY + 0.5) {
                    displacementDone = true;
                }
            } else if (player.currentDisplacement === "down") {
                if (player.y > player.lockedTileY + 0.5) {
                    displacementDone = true;
                }
            } else if (player.currentDisplacement === "left") {
                if (player.x < player.lockedTileX + 0.5) {
                    displacementDone = true;
                }
            } else if (player.currentDisplacement === "right") {
                if (player.x > player.lockedTileX + 0.5) {
                    displacementDone = true;
                }
            }
            // If we went futher than locked tile
            if (displacementDone) {
                // If we go in same direction we just need to check if it's possible
                if (player.targetDisplacement === player.currentDisplacement) {
                    if (canGo[player.direction]) {
                        player.setLockedTile(
                            nextPos.tileX + player.xDirection,
                            nextPos.tileY + player.yDirection
                        );
                    } else {
                        player.setLockedTile(player.tileX, player.tileY);
                        nextPos.x = player.lockedTileX + 0.5;
                        nextPos.y = player.lockedTileY + 0.5;
                        player.isDirty = true;
                        player.moving = false;
                    }
                } else {
                    player.currentDisplacement = "none";
                    player.setLockedTile(player.tileX, player.tileY);

                    nextPos.x = player.lockedTileX + 0.5;
                    nextPos.y = player.lockedTileY + 0.5;
                    player.isDirty = true;
                    player.moving = false;
                }
            }
        }

        player.x = nextPos.x;
        player.y = nextPos.y;
    }
}

module.exports = Level;
