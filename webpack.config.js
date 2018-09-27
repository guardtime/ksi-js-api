const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/main.ts',
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
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        globalObject: 'this',
        library: 'KSI'
    },
    optimization: {
        minimize: true
    },
    devServer: {
        contentBase: './browser/',
        publicPath: '/scripts/',
    },
};
