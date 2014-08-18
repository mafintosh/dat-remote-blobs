# dat-remote-blobs

Blob store that uses the dat remote api

```
npm install dat-remote-blobs
```

## Usage

``` js
var blobs = require('./')
var zlib = require('zlib')
var tar = require('tar-stream')

// pass a url to a remote dat instance
var npm = blobs('npm.dathub.org')

// key + filename or hash is required
var rs = npm.createReadStream({
  key: '2gis',
  name: '2gis-0.0.2.tgz'
})

// this is a tarball - print the contents
rs.pipe(zlib.createGunzip()).pipe(tar.extract())
  .on('entry', function(header, stream, next) {
    console.log(header)
    next()
  })
```

## License

MIT