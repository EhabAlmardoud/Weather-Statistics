const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // new webpack.DefinePlugin({ // <-- key to reducing React's size
    //    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // }),
    // new webpack.optimize.DedupePlugin(), //dedupe similar code 
    // new webpack.optimize.UglifyJsPlugin(), //minify everything
    // new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
]
});