# Streaming saving file

[![Build Status](https://travis-ci.org/chilijung/file-save.png)](https://travis-ci.org/chilijung/file-save)

Streaming data to file and save it using Stream.(the module will make directory itself if the directory is not exist).

## Install

```
npm install file-save
```

## Example

```javascript
var fileSave = require('file-save');

// the first line will create a writeStream to the file path
fileSave('sample/test')
    .write('this is the first line', 'utf8')
    .write('this is the second line', 'utf8', function() {
        console.log('writer callback')
    })
    .end('this is the end')
    .error(function() {
        console.log('error goes here')
    })
    .finish(function() {
        console.log('write finished.')
    })
```

## Usage

```
fileSave(<filename>)
```

`file-save` module will build a write stream to the file, and automatically make directory if the directory is not exist and need to create.

## Chaining methods

#### .write(chunk, [encoding], [callbak])

- chunk (string)
- encoding (string): like the encoding settings in writeable stream. http://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback 
- callback (function): callback function settings in writeable http://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback

#### .end([string], [encoding], [callback])

Same as `.write` method, but string is also optional.

#### .error(callback)

You can make a callback, while the stream prompt error

see more: http://nodejs.org/api/stream.html#stream_event_error_1

#### .finish(callback)

Make a callback while finished, **using this method you have to call ** `.foot` **before calling this method**

see more: http://nodejs.org/api/stream.html#stream_event_finish

## License

MIT [@chilijung](http://github.com/chilijung)
