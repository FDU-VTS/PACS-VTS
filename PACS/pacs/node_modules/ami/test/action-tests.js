var Action = require(__dirname + '/../lib/action');

describe('Action', function() {
  describe('actionID', function(){
    
    it('auto-increments', function() {
      var action1 = new Action();
      var action2 = new Action();
      var action3 = new Action();
      action1.actionID.should.be.lessThan(action2.actionID);
      action2.actionID.should.be.lessThan(action3.actionID);
    })
  })
  
  describe('serialization', function() {
    it('produces correct result', function() {
      var action = new Action({
        name: 'brian',
        age: 11
      })
      action.serialize().should.equal('Name: brian\r\nAge: 11\r\n\ActionID: ' + action.actionID + '\r\n\r\n');
    })
    
  })
})
