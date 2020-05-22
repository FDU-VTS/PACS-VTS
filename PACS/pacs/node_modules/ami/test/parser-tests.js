var Parser = require(__dirname + '/../lib/parser');

describe('Parser', function() {

  it('parses single tuple message', function(done) {
    var parser = new Parser();
    parser.on('parse', function(msg) {
      Object.keys(msg).length.should.equal(1, "Should have 1 key");
      Object.keys(msg).should.include('name');
      msg.name.should.equal('brian');
      done();
    })
    parser.parse('Name: brian\r\n\r\n');
  })

  it('parses greeting', function(done) {
    var parser = new Parser();
    parser.on('parse', function(msg) {
      msg.should.equal('asterisk Manager Interface 1.1/0')
      done();
    })
    parser.parse('Asterisk Manager Interface 1.1/0\r\n');
  })

  it('parses multi tuple message', function(done) {
    var parser = new Parser();
    parser.on('parse', function(msg) {
      var keys = Object.keys(msg);
      keys.length.should.equal(2);
      keys.should.include('name');
      keys.should.include('age');
      msg.name.should.equal('Brian');
      msg.age.should.equal('25');
      done();
    })
    parser.parse('Name: Brian\r\nAge: 25\r\n\r\n');
  })

  it('parses multiple messages', function(done) {
    var parser = new Parser();
    parser.once('parse', function(msg) {
      msg.should.equal('hello from asterisk');
      parser.once('parse', function(msg) {
        msg.name.should.equal('Brian');
        parser.once('parse', function(msg) {
          msg.age.should.equal('25');
          done();
        })
      })
    })
    parser.parse('hello from asterisk\r\n');
    parser.parse('Name: Brian\r\n\r\nAge: 25\r\n\r\n');
  })

  it('parses split messages', function(done) {
    var parser = new Parser();
    parser.once('parse', function(msg) {
      msg.name.should.equal('Brian');
      msg.age.should.equal('25');
      parser.once('parse', function(msg) {
        msg.weight.should.equal('175');
        done();
      })
    })
    parser.parse('Na');
    parser.parse('me: Brian\r');
    parser.parse('\nAge: 25\r\n');
    parser.parse('\r\nWeight: 175\r\n\r');
    parser.parse('\n');
  })

})
