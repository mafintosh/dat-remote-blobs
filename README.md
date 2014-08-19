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

// key is required
var rs = npm.createReadStream({
  key: '21d0324a65be1bf3e653d129360c6c2636c3ce68b5568f3ee3d4ea2a3daa0b09'
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