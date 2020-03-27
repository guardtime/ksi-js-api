/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

const path = require('path');

const outputPath = path.resolve(__dirname, 'dist');

const web = {
  mode: 'production',
  entry: './src/web/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    filename: 'main.js',
    path: outputPath,
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'KSI'
  },
  devServer: {
    contentBase: [path.join(__dirname, './web'), path.join(__dirname, './config')],
    publicPath: '/dist/'
  }
};

const nodejs = {
  mode: 'production',
  entry: './src/nodejs/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    filename: 'main.node.js',
    path: outputPath,
    libraryTarget: 'commonjs2',
    globalObject: 'this',
    library: 'KSI'
  },
  target: 'node'
};

module.exports = [web, nodejs];
