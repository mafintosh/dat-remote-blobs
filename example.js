var blobs = require('./')
var zlib = require('zlib')
var tar = require('tar-stream')

var npm = blobs('npm.dathub.org')

npm.exists({
  key: '2gis',
  filename: '2gis-0.0.2.tgz'
}, console.log)

var rs = npm.createReadStream({
  key: '2gis',
  filename: '2gis-0.0.2.tgz'
})

rs.pipe(zlib.createGunzip()).pipe(tar.extract())
  .on('entry', function(header, stream, next) {
    console.log(header)
    next()
  })