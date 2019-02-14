module.exports = {
  test    : /\.(jsx)$/,
  exclude: /(node_modules|build|dist\/)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-react-jsx', "@babel/plugin-transform-runtime"]
    }
  }
};
