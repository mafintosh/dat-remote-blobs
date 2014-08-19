var request = require('request')
var once = require('once')
var eos = require('end-of-stream')

module.exports = function(remote) {
  if (remote.indexOf('://') === -1) remote = 'http://'+remote

  var that = {}

  var req = function(method, opts) {
    return request(remote+'/api/rows/'+encodeURIComponent(opts.key)+'/'+encodeURIComponent(opts.name || opts.filename), {
      method: method,
      qs: {
        version: opts.version
      }
    })
  }

  var onend = function(req, opts, cb) {
    eos(req, function(err) {
      if (err) return cb(err)
      cb(null, opts)
    })
    return req
  }

  that.createReadStream = function(opts) {
    if (opts.link) return request(opts.link)
    if (opts.hash) return request(remote+'/api/blobs/'+opts.hash)
    return req('GET', opts)
  }

  that.createWriteStream = function(opts, cb) {
    if (typeof opts === 'function') throw new Error('options are required')
    if (opts.link) return onend(request.put(opts.link), opts, cb)
    return onend(req('POST', opts), opts, cb)
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