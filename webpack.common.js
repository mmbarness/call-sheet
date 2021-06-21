const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { node } = require("webpack");
const outputDir = "./dist";

module.exports = {
  entry: './src/index.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js",
  },
  resolve: {
    extensions: [".js"], // if we were using React.js, we would include ".jsx"
  },
  module: {
    rules: [
      {
        test: /\.js$/, // if we were using React.js, we would use \.jsx?$/
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
            exclude: /node_modules/,
          }, // if we were using React.js, we would include "react"
        },
      },
    ],
  }
};
