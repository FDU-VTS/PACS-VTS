var fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  _savefs = savefs,
  savefs = {};

module.exports = function(file, opts) {

  dir_name= path.dirname(file)
  // origin file path
  ori_path = path.resolve(file);
  // folder path
  dir_path = path.resolve(dir_name);

  savefs._create_dir(dir_path, opts)
  
  return savefs.wstream(ori_path)
}

savefs._create_dir = function (fp, opts) {
  mkdirp.sync(fp, opts);
}

savefs.wstream = function (file) {
  var ws = fs.createWriteStream(file);
  this.writer = ws;
  return this;
}

// chaining write method
savefs.write = function(chunk, encoding, cb) {
  if(arguments.length === 3) {
    this.writer.write(chunk, encoding, cb);
  }else if(arguments.length === 2 && typeof arguments[1] === 'function') {
    cb = encoding;
    encoding = null;
    this.writer.write(chunk, cb);
  }else if(arguments.length === 2 && typeof arguments[1] !== 'function') {
    this.writer.write(chunk, encoding)
  }else {
    this.writer.write(chunk)
  }

  return this;
}

// chaining end method
savefs.end = function(chunk, encoding, cb) {
  if(arguments.length === 3) {
    this.writer.end(chunk, encoding, cb);
  }else if(arguments.length === 2 && typeof arguments[1] === 'function') {
    cb = encoding;
    encoding = null;
    this.writer.end(chunk, cb);
  }else if(arguments.length === 2 && typeof arguments[1] !== 'function') {
    this.writer.end(chunk, encoding)
  }else {
    this.writer.end(chunk)
  }

  return this;
}

savefs.finish = function(cb) {
  this.writer.on('finish', cb);
}

savefs.error = function(cb) {
  this.writer.on('error', cb);
} 