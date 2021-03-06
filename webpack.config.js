const devCerts = require("office-addin-dev-certs");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require('path');

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      vendor: ["react", "react-dom", "core-js"],
      taskpane: ["react-hot-loader/patch", "./src/index.tsx"],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js", ".css"],
      alias: {react: path.resolve('./node_modules/react')}
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["react-hot-loader/webpack", "ts-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          include: path.join(__dirname, 'src/components'),
          use: [
            'style-loader',
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                namedExport: true
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
            loader: "file-loader",
            query: {
              name: "assets/[name].[ext]"
            }
          }
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        {
          to: "taskpane.css",
          from: "./src/taskpane.css"
        }
      ]),
      new CopyWebpackPlugin([
        {
          to: "normalize.css",
          from: "./src/normalize.css"
        }
      ]),

      new ExtractTextPlugin("[name].[hash].css"),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane.html",
        chunks: ["taskpane", "vendor", "polyfills"]
      }),
      new CopyWebpackPlugin([
        {
          from: "./assets",
          ignore: ["*.scss"],
          to: "assets"
        }
      ]),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"]
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      https: await devCerts.getHttpsServerOptions(),
      port: 3000
    }
  };

  return config;
};
