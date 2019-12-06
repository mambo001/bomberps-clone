const Player = require("./Player");
const process = require("process");
const Level = require("./Level");

const MAX_PARTY_SIZE = 4;

const hrtimeMs = function() {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
};

const getSpawnLoc = function(spawn) {
    switch (spawn) {
        case 0:
            return { x: 1, y: 1 };
        case 1:
            return { x: 13, y: 1 };
        case 2:
            return { x: 13, y: 11 };
        case 3:
            return { x: 1, y: 11 };
    }
};
class Party {
    constructor(id, controller) {
        this._id = id;
        this._partyController = controller;

        this.lastUpdateTime = hrtimeMs();
        this._handle = setInterval(() => this.loop(), 1000 / 60);

        this.availableSpawns = [true, true, true, true];

        this.level = new Level(this);
        this.level.tiles = controller.generator.generateTiles();
        this.runningPlayers = []; // Array containing players that still have lives
    }

    get id() {
        return this._id;
    }

    get size() {
        return this.level.players.length;
    }

    update(delta) {
        // if there is only one remaining player, we end the game
        if (process.env.NODE_ENV === "development") {
            if (this.runningPlayers.length < 1) {
                this.end();
            }
        } else {
            if (this.runningPlayers.length <= 1) {
                this.end();
            }
        }

        let bomb;
        for (let i = 0; i < this.level.bombs.length; i++) {
            bomb = this.level.bombs[i];
            bomb.update(delta);
            if (bomb.mustExplode) {
                this.createExplosion(bomb.tileX, bomb.tileY, 3, bomb.player);
                this.removeBomb(bomb);
            }
        }
        bomb = undefined;

        for (const player of this.level.players) {
            player.update(delta);
            this.level.updatePlayer(delta, player);
            if (player.isDirty) {
                this.broadcast("player-update", {
                    id: player.id,
                    x: player.x,
                    y: player.y,
                    moving: player.moving,
                    direction: player.currentDisplacement
                });
                player.isDirty = false;
            }
        }
    }

    loop() {
        var currentTime = hrtimeMs();
        var delta = (currentTime - this.lastUpdateTime) / 1000;

        this.update(delta);

        this.lastUpdateTime = currentTime;
    }

    createExplosion(x, y, radius, caster) {
        this.broadcast("effect", {
            type: "explosion",
            x: x,
            y: y,
            radius: radius
        });

        if (radius !== 0) {
            this.level.explodeTile(x, y, caster);
        }
        // Explode tiles at right
        for (let i = 1; i < radius; i++) {
            if (x + i > 15) break;
            if (this.level.isTileBlocked(x + i, y)) {
                this.level.explodeTile(x + i, y, caster);
                break;
            }
            this.level.explodeTile(x + i, y, caster);
        }
        // Explode tiles at left
        for (let i = 1; i < radius; i++) {
            if (x - i < 0) break;
            if (this.level.isTileBlocked(x - i, y)) {
                this.level.explodeTile(x - i, y, caster);
                break;
            }
            this.level.explodeTile(x - i, y, caster);
        }
        // Explode up tiles
        for (let i = 1; i < radius; i++) {
            if (y - i < 0) break;
            if (this.level.isTileBlocked(x, y - i)) {
                this.level.explodeTile(x, y - i, caster);
                break;
            }
            this.level.explodeTile(x, y - i, caster);
        }
        // Explode down tiles
        for (let i = 1; i < radius; i++) {
            if (y + i > 13) break;
            if (this.level.isTileBlocked(x, y + i)) {
                this.level.explodeTile(x, y + i, caster);
                break;
            }
            this.level.explodeTile(x, y + i, caster);
        }
    }

    broadcast(eventName, arg) {
        for (var i = 0; i < this.level.players.length; i++) {
            this.level.players[i].socket.emit(eventName, arg);
        }
    }

    addPlayer(socket) {
        if (this.size >= MAX_PARTY_SIZE) {
            console.log("This party is full");
            return;
        }
        let player = new Player(socket);
        player.subscribe(this);
        this.runningPlayers.push(player);
        let spawnPos;
        for (let i = 0; i < this.availableSpawns.length; i++) {
            if (this.availableSpawns[i]) {
                spawnPos = getSpawnLoc(i);
                this.availableSpawns[i] = false;
                player.spawnIndex = i;
                break;
            }
        }
        player.spawnX = spawnPos.x;
        player.spawnY = spawnPos.y;

        this.spawnPlayer(player);

        for (const p of this.level.players) {
            player.socket.emit("player-add", {
                id: p.id,
                x: p.x,
                y: p.y,
                speed: p.speed
            });
        }
        for (const bomb of this.level.bombs) {
            player.socket.emit("entity-add", {
                id: bomb.id,
                texture: "bomb",
                x: bomb.x,
                y: bomb.y
            });
        }
        this.level.players.push(player);
        this.broadcast("player-add", {
            id: player.id,
            x: player.x,
            y: player.y,
            speed: player.speed
        });
        return player;
    }

    spawnPlayer(player) {
        player.visible = true;
        player.x = player.spawnX + 0.5;
        player.y = player.spawnY + 0.5;
        this.broadcast("player-update", {
            id: player.id,
            x: player.x,
            y: player.y,
            visible: player.visible,
            moving: player.moving,
            direction: player.currentDisplacement
        });
    }

    killPlayer(player) {
        player.dead = true;
        if (player.lives < 0) return;
        player.visible = false;
        player.lives--;
        player.spawnCooldown = 3.5;
        player.resetDisplacement();
        console.log("killing player %s, %i", player.id, player.lives);

        if (player.lives < 0) {
            this.runningPlayers.splice(this.runningPlayers.indexOf(player), 1);
        }

        this.broadcast("player-update", {
            id: player.id,
            visible: player.visible,
            moving: player.moving,
            direction: player.currentDisplacement
        });
    }

    poseBomb(player) {
        let bomb = this.level.addBomb(player);
        if (bomb !== null) {
            this.broadcast("entity-add", {
                id: bomb.id,
                texture: "bomb.png",
                x: bomb.x,
                y: bomb.y
            });
            console.log("Bomb (%i) added !", bomb.id);
        }
    }

    removeBomb(bomb) {
        this.level.removeBomb(bomb);
        console.log("bombs len = ", this.level.bombs.length);

        this.broadcast("entity-remove", { id: bomb.id });
    }

    removePlayer(socket) {
        let index = this.level.players.findIndex(x => x.socket.id == socket.id);
        if (index != -1) {
            console.log(
                "Player %s is leaving the party.",
                this.level.players[index].id
            );
            this.level.players[index].lives = 0;
            this.killPlayer(this.level.players[index]);

            this.availableSpawns[this.level.players[index].spawnIndex] = true;
            this.broadcast("player-remove", {
                id: this.level.players[index].id
            });
            this.level.players[index].unsubscribe();
            this.level.players.splice(index, 1);
        }
    }

    end() {
        let scoreArray = [];
        for (const player of this.level.players) {
            scoreArray.push({
                id: player.id,
                score: player.score
            });
        }
        scoreArray.sort((a, b) => {
            return b.score - a.score;
        });
        this.broadcast("end-game", {
            scores: scoreArray
        });
        this._partyController.endParty(this);
    }

    dispose() {
        clearInterval(this._handle);
    }

    _resetMap() {
        this.level.tiles = this._partyController.generator.generateTiles();
        this.broadcast("map-set", this.level.tiles);
    }
}

module.exports = Party;
