const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home.js',
    chat: './src/pages/chat.js',
    login: './src/pages/login.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'chat.html',
    chunks: ['chat']
  }),

    new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'login.html',
    chunks: ['login']
  })
  ],
  mode: 'development'
};
