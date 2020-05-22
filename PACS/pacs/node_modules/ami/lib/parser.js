var EventEmitter = require('events').EventEmitter;
var util = require('util');

//parses AMI incomming protocol messages
var Parser = function() {
  EventEmitter.call(this);
  this.lastPacket = '';
  this.reset();
}

util.inherits(Parser, EventEmitter);

var x = 0;
Parser.FIRST_CR = x++;
Parser.FIRST_NL = x++;
Parser.SECOND_CR = x++;
Parser.SECOND_NL = x++;
Parser.FIRST_KEY = x++;
Parser.KEY = x++;
Parser.VALUE = x++;
Parser.GREETING = x++;

Parser.prototype.reset = function() {
  this.message = { };
  this.key = '';
  this.value = '';
  this.setState(Parser.FIRST_KEY);
}

//used to pretty-print state names for debuggin
Parser.prototype.getStateName = function(state) {
  for(var key in Parser) {
    if(!Parser.hasOwnProperty(key)) continue;
    var value = Parser[key];
    if(value === state) return key;
  }
}

Parser.prototype.setState = function(newState) {
  //console.log('changing from %s to %s', this.getStateName(this.state), this.getStateName(newState));
  this.state = newState;
}

Parser.prototype.isState = function(state) {
  return state === this.state;
}

Parser.prototype.parse = function(newPacket) {
  var packet = this.lastPacket + newPacket;
  for(var i = 0, char; char = packet[i]; i++) {
    switch(char) {
      case '\r':
        if(this.isState(Parser.FIRST_NL)) {
          this.setState(Parser.SECOND_CR);
        } else if(this.isState(Parser.KEY)) {
            this.setState(Parser.GREETING);
        } else {
          this.setState(Parser.FIRST_CR);
        }
        break;
      case '\n':
        if(this.isState(Parser.FIRST_CR)) {
          this.message[this.key] = this.value;
          this.key = this.value = '';
          this.setState(Parser.FIRST_NL);
        }
        else if(this.isState(Parser.SECOND_CR)) {
          this.emit('parse', this.message);
          this.reset();
        }
        else if(this.isState(Parser.GREETING)) {
          this.emit('parse', this.key);
          this.reset();
        }
        break;
      case ':':
        //skip space after colon
        this.setState(Parser.VALUE);
        i++;
        break;
      default:
        if(this.isState(Parser.FIRST_KEY) || this.isState(Parser.FIRST_NL)) {
          //make keys javascript casing
          this.key += char.toLowerCase();
          this.setState(Parser.KEY);
        }
        else if(this.isState(Parser.KEY)) {
          this.key += char;
        }
        else if(this.isState(Parser.VALUE)) {
          this.value += char;
        }
        break;
    }
  }
}

module.exports = Parser;
