
// Express middleware that will print the url of a request for logging before
// the 'next' stage of the pipeline that will handle the request
function printURL (req, res, next) {
  console.log(req.url)
  next()
}

// 404 Errors
function fileNotFound (req, res) {
  const url = req.url
  res.type('text/plain')
  res.status(404)
  res.send('Cannot find ' + url)
}

module.exports = {
  printURL,
  fileNotFound
}
