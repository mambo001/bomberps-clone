const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const CLIENT_TILE_SIZE = 64;
const MAP_TILE_WIDTH = 15;
const MAP_PIXEL_WIDTH = MAP_TILE_WIDTH * CLIENT_TILE_SIZE;
const MAP_TILE_HEIGHT = 13;
const MAP_PIXEL_HEIGHT = MAP_TILE_HEIGHT * CLIENT_TILE_SIZE;

module.exports = {
    entry: {
        game: "./app/view/game.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/app/view/dist/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: { presets: ["@babel/preset-env"] }
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "app/view/assets",
                to: "assets/"
            }
        ]),
        new HTMLWebpackPlugin({
            template: "app/view/index.html",
            filename: "index.html"
        }),
        new webpack.DefinePlugin({
            TILE_SIZE: CLIENT_TILE_SIZE,
            MAP_TILE_WIDTH: MAP_TILE_WIDTH,
            MAP_PIXEL_WIDTH: MAP_PIXEL_WIDTH,
            MAP_TILE_HEIGHT: MAP_TILE_HEIGHT,
            MAP_PIXEL_HEIGHT: MAP_PIXEL_HEIGHT
        })
    ]
};
