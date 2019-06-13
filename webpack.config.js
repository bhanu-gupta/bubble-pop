const path = require('path');

module.exports = {
    context: __dirname,
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname),
        filename: "./dist/bundle.js"
    },
    devtool: 'eval-source-map'
};