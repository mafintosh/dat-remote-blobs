var request = require('request')
var once = require('once')
var eos = require('end-of-stream')

module.exports = function(opts) {
  if (typeof opts === 'string') opts = {url:opts}
  if (!opts) opts = {}

  var url = opts.url
  if (url && url.indexOf('://') === -1) url = 'http://'+url

  var that = {}

  var onend = function(req, opts, cb) {
    eos(req, function(err) {
      if (err) return cb(err)
      cb(null, opts)
    })
    return req
  }

  that.createReadStream = function(opts) {
    if (opts.link) return request(opts.link)
    return request(url+'/api/blobs/'+opts.key)
  }

  that.createWriteStream = function(opts, cb) {
    if (typeof opts === 'function') throw new Error('options are required')
    if (opts.link) return onend(request.put(opts.link), opts, cb)
    throw new Error('link is required for updates')
  }

  that.exists = function(opts, cb) {
    var req = that.createReadStream(opts)
    cb = once(cb)

    req.on('error', cb)
    req.on('response', function(res) {
      cb(null, res.statusCode === 200)
      req.abort()
    })
  }

  return that
}