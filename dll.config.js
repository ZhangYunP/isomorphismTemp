const webpack= require('webpack')
const path= require('path')
const args= require('yargs').argv
const version= args.vs

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'react-addons-css-transition-group']
  },
  output: {
    path: path.resolve(__dirname, 'client/v'+ version +'/src/scripts'),
    filename: '[name].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]_[hash]',
      context: __dirname
    })
  ]
}
