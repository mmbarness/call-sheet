const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { node } = require("webpack");
const outputDir = "./dist";

module.exports = {
  entry: './src/index.ts', 
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
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: "../",
            },
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ca]ss/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: "../",
            },
          },
          "css-loader",
          {
            loader: "sass-loader", 
            options: {
              implementation: require('sass')
            }
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    require("autoprefixer"),
  ],
  target: 'node'
};
