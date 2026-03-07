const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home.js',
    chat: './src/pages/chat.js',
    login: './src/pages/login.js',
    register: './src/pages/register.js',
    group: './src/pages/group.js'
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
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset/resource'
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
  }),

  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'register.html',
    chunks: ['register']
  }),

  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'group.html',
    chunks: ['group']
  })
  ],
  mode: 'development'
};
