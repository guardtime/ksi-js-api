const path = require('path');

const outputPath = path.resolve(__dirname, 'dist');

const web = {
    mode: "production",
    entry: './src/web/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js', '.json' ]
    },
    output: {
        filename: 'main.js',
        path: outputPath,
        libraryTarget: 'umd',
        globalObject: 'this',
        library: 'KSI'
    },
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: [path.join(__dirname, './web'), path.join(__dirname, './config')],
        publicPath: '/dist/',
    }
};

const nodejs = {
    mode: "production",
    entry: './src/nodejs/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js', '.json' ]
    },
    output: {
        filename: 'main.node.js',
        path: outputPath,
        libraryTarget: 'commonjs2',
        globalObject: 'this',
        library: 'KSI'
    },
    optimization: {
        minimize: false
    },
    target: 'node',

};

module.exports = [web, nodejs];
