const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
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
        })
    ]
};
