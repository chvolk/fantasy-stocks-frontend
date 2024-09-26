module.exports = {
  devServer: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval';"
    }
  }
}