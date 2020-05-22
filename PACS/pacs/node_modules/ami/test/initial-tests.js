var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MemorySocket = require('memory-socket')

var ami = require(__dirname + '/../lib');
var Action = require(__dirname + '/../lib/action');

describe('Client', function() {
  describe('connection', function() {
    describe('success', function() {
      var socket = new MemorySocket();
      var client = new ami.Client(socket);
      var port = 5038;
      var host = 'localhost';

      before(function(done) {
        socket.emitSoon('connect');
        client.connect(port, host, done);
      })

      it('sets socket properties', function() {
        client.socket.port.should.equal(5038);
        client.socket.host.should.equal('localhost');
      })
    })

    describe('error', function() {
      var socket = new MemorySocket();
      var client = new ami.Client(socket);
      var port = 5038;
      var host = 'localhost';
      
      it('emits error', function(done) {
        client.connect(1234);
        client.on('error', function() {
          done();
        });
        socket.emitSoon('error', new Error("fake error"));
      })
    })
  })

  describe('login', function() {
    describe('success', function() {
      var socket = new MemorySocket();
      var client = new ami.Client(socket);

      var loginAction = {
        action: 'login',
        username: 'user',
        secret: 'pass'
      }

      beforeEach(function() {
        socket = new MemorySocket();
        client = new ami.Client(socket);
        //enqueue a successful login message
        var packet = 'Response: Success\r\nActionID: ' + Action.lastActionID + '\r\nMessage: Authentication accepted\r\n\r\n'
        socket.emitSoon('data', Buffer(packet,'utf8'))
      })


      it('sends correct login message', function() {
        client.send(loginAction);
        var expectedData = 'Action: login\r\nUsername: user\r\nSecret: pass\r\nActionID: ' + (Action.lastActionID-1) + '\r\n\r\n';
        socket.data[0].should.equal(expectedData);
      })

      it('calls callback with no error', function(done) {
        client.send(loginAction, done);
      })

      it('emits a login success message', function(done) {
        client.send(loginAction);
        client.on('message', function(msg) {
          msg.actionID.should.equal((Action.lastActionID-1).toString());
          msg.response.should.equal('Success');
          msg.message.should.equal('Authentication accepted');
          done();
        })
      })

      it('removes completed action from action queue', function() {
        client._pendingActions.length.should.equal(0);
        client.send(loginAction, function(err) {
          process.nextTick(function() {
            client._pendingActions.length.should.equal(0);
          })
        })
        client._pendingActions.length.should.equal(1);
      })
    })
  })
})

describe('Client', function() {
  describe('incomming message parsing', function() {

    it('doesn\'t choke on startup greeting message', function(done) {
      var socket = new MemorySocket();
      var client = new ami.Client(socket);
      socket.emitSoon('data', Buffer('Asterisk Call Manager/1.1\r\n', 'utf8'));

      client.on('message', function(msg) {
        msg.should.equal('asterisk Call Manager/1.1');
        done();
      })
    })

  })

  describe('split packets', function(done) {
    return;
    var socket = new MemorySocket();
    var client = new ami.Client(socket);
    client.socket.on('data', function() {
      console.log('msg: \n"%s"', arguments[0].toString('utf8'));
    })

    before(function() {
      //socket.emitSoon('data', Buffer('Asterisk Call Man'))
      //socket.emitSoon('data', Buffer('ager/1.1\r\n'))
      var firstPartOfResponse = ''
      socket.emitSoon('data', Buffer('Response: Success\r\nActionID: ', 'utf8'))
      socket.emitSoon('data', Buffer(Action.lastActionID + '\r\nMessage: test\r\n\r\n'))
    })

    it('parse correctly', function(done) {
      client.login('name', 'pw');
      client.on('message', function(msg) {
        done()
      })
    })
  })
})
