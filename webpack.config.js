const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// var nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            fs: false,
            net: false,
            tls: false,
            child_process: false,
            dgram: false
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin({})
    ],
    target: "web",
    watch: true
}