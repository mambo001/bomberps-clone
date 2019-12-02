const openSimplexNoise = require("./openSimplexNoise");

class LevelGenerator {
    constructor() {
        this.noise = null;
        this.height = 13;
        this.width = 15;
        this.minWalls = 25;
        this.zoom = 1 / 2;
        this.default_tiles = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1],
            [1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, -1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, -1, 1],
            [1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    generateTiles() {
        this.noise = openSimplexNoise(Date.now());
        this.tiles = [
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
        this.wallPlaced = 0;
        let offset = 0;
        while (this.wallPlaced < this.minWalls) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    const value =
                        (this.noise.noise2D(
                            x / this.zoom + offset * 15,
                            y / this.zoom + offset * 13
                        ) +
                            1) /
                        2;
                    if (value >= 0.5) {
                        this.tiles[y][x] = 2;
                        this.wallPlaced++;
                    }
                }
            }
            offset++;

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    const value =
                        (this.noise.noise2D(
                            x / this.zoom + offset * 15,
                            y / this.zoom + offset * 13
                        ) +
                            1) /
                        2;
                    if (value >= 0.65) {
                        this.tiles[y][x] = 2;
                        this.wallPlaced++;
                    }
                }
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                const value = this.noise.noise2D(
                    x / (this.zoom * 2),
                    y / (this.zoom * 2)
                );
                if (value >= 0.9) {
                    this.tiles[y][x] = 2;
                }
                if (value < -0.6) {
                    this.tiles[y][x] = 0;
                }
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.default_tiles[y][x] > 0) {
                    this.tiles[y][x] = this.default_tiles[y][x];
                }
                if (this.default_tiles[y][x] === -1) {
                    this.tiles[y][x] = 0;
                }
            }
        }

        return this.tiles;
    }
}

module.exports = LevelGenerator;
