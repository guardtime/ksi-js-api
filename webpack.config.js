/*
 * Copyright 2013-2020 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

const LicenseCheckerWebpackPlugin = require('license-checker-webpack-plugin');
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
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  // TODO: Currently broken with latest webpack
  // plugins: [new LicenseCheckerWebpackPlugin(
  //   {
  //     outputFilename: "ThirdPartyNotices.txt",
  //     allow: "(Apache-2.0 OR BSD-3-Clause OR MIT OR ISC OR Unlicense)",
  //     override: {
  //       "isomorphic-unfetch@^3.0.0": { licenseName: "MIT" }
  //     }
  //   }
  // )
  // ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    fallback: {
      crypto: false,
    },
  },
  output: {
    filename: 'main.js',
    path: outputPath,
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'KSI',
  },
  devServer: {
    contentBase: [path.join(__dirname, './web'), path.join(__dirname, './config')],
    publicPath: '/dist/',
  },
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
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  // TODO: Currently broken with latest webpack
  // plugins: [new LicenseCheckerWebpackPlugin(
  //   {
  //     outputFilename: "ThirdPartyNotices.txt",
  //     allow: "(Apache-2.0 OR BSD-3-Clause OR MIT OR ISC OR Unlicense)",
  //     override: {
  //       "isomorphic-unfetch@^3.0.0": { licenseName: "MIT" }
  //     }
  //   }
  //   )
  // ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    fallback: {
      crypto: false,
    },
  },
  output: {
    filename: 'main.node.js',
    path: outputPath,
    libraryTarget: 'commonjs2',
    globalObject: 'this',
    library: 'KSI',
  },
  target: 'node',
};

module.exports = [web, nodejs];
