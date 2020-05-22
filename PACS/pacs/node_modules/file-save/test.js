var should = require('should');
var fs = require('fs');
var fileSave = require('./');

describe('should save the file test', function() {
  it('should save to sample folder', function(cb) {
    // the first line will create a writeStream to the file path
    fileSave('sample/test')
        .write('this is the first line\n', 'utf8')
        .write('this is the second line\n', 'utf8', function() {
            console.log('writer callback')
        })
        .end('this is the end\n')
        .finish(function() {
            cb();
        })
  })

})
