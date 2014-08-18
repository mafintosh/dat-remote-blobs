var request = require('request')
var once = require('once')

module.exports = function(remote) {
  if (remote.indexOf('://') === -1) remote = 'http://'+remote

  var that = {}

  var req = function(method, opts) {
    return request(remote+'/api/rows/'+encodeURIComponent(opts.key)+'/'+encodeURIComponent(opts.filename), {
      method: method,
      qs: {
        version: opts.version
      }
    })
  }

  that.createReadStream = function(opts) {
    if (opts.link) return request(opts.link)
    if (opts.hash) return request(remote+'/api/blobs/'+opts.hash)
    return req('GET', opts)
  }

  that.createWriteStream = function(opts) {
    if (opts.link) return request.put(opts.link)
    return req('POST', opts)
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