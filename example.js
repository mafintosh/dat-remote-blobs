var blobs = require('./')
var zlib = require('zlib')
var tar = require('tar-stream')

var npm = blobs('npm.dathub.org')

var rs = npm.createReadStream({
  key: '21d0324a65be1bf3e653d129360c6c2636c3ce68b5568f3ee3d4ea2a3daa0b09'
})

rs.pipe(zlib.createGunzip()).pipe(tar.extract())
  .on('entry', function(header, stream, next) {
    console.log(header)
    next()
  })