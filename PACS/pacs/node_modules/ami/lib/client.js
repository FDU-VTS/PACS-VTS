var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Action = require(__dirname + '/action');
var Parser = require(__dirname + '/parser');
var Client = function(socket) {
  EventEmitter.call(this);
  this.socket = socket || new require('net').Socket();
  this._pendingActions = [];

  var parser = this.parser = new Parser();
  this.socket.setEncoding('utf8');
  this.socket.on('error', this.emit.bind(this, 'error'))
  this.socket.on('data', parser.parse.bind(parser));
  parser.on('parse', this._receive.bind(this));
}

util.inherits(Client, EventEmitter);

//connect client to asterisk AMI server
Client.prototype.connect = function(port, host, connectListener) {
  this.socket.connect(port, host, connectListener);
}

//receive a message from the parser
Client.prototype._receive = function(message) {
  //find corresponding action
  if(message.actionID) {
    for(var i = 0, action; action = this._pendingActions[i]; i++) {
      if(action.actionID == message.actionID) {
        var done = action.receive(message);
        if(done) {
          //remove this action
          this._pendingActions.splice(i, 1);
        }
        break;
      }
    }
  }
  this.emit('message', message);
}

//send an action to the server
Client.prototype.send = function(action, callback) {
  if(!(action instanceof Action)) {
    action = new Action(action);
  }
  this._pendingActions.push(action);
  if(callback) {
    action.callback = callback;
  }
  this.socket.write(action.serialize());
}

module.exports = Client;
