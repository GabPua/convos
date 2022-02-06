const sinon = require('sinon');
const Group = require('../../group_management/group');
const Member = require('../../group_management/member');
const ctrl = require('../../group_management/group_ctrl');

describe('Remove Member', () => {
  let req, groupFindStub, memberFindStub, deleteStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    groupFindStub.restore();
    memberFindStub.restore();
    deleteStub.restore();
  });

  it('encountered an error in removing member', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const error = new Error();
    groupFindStub = sinon.stub(Group, 'findById').throws(error);
    memberFindStub = sinon.stub(Member, 'findOne');
    deleteStub = sinon.stub(Member, 'deleteOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.notCalled(Member.findOne);
          sinon.assert.notCalled(Member.deleteOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('did not find the group or membership status', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => { return null; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(mock);
    memberFindStub = sinon.stub(Member, 'findOne').resolves(null);
    deleteStub = sinon.stub(Member, 'deleteOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.findOne, member);
          sinon.assert.notCalled(Member.deleteOne);
          done();
        } catch (error) {
          done(error);
        }
      },

      status: (result) => {
        expect(result).toBe(401);
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is trying to remove the admin', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(mock);
    memberFindStub = sinon.stub(Member, 'findOne').resolves(true);
    deleteStub = sinon.stub(Member, 'deleteOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.findOne, member);
          sinon.assert.notCalled(Member.deleteOne);
          done();
        } catch (error) {
          done(error);
        }
      },

      status: (result) => {
        expect(result).toBe(401);
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is trying to remove another member as a member', (done) => {
    req.body.userId = 'another@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(mock);
    memberFindStub = sinon.stub(Member, 'findOne').resolves(true);
    deleteStub = sinon.stub(Member, 'deleteOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.findOne, member);
          sinon.assert.notCalled(Member.deleteOne);
          done();
        } catch (error) {
          done(error);
        }
      },

      status: (result) => {
        expect(result).toBe(401);
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is trying to remove another member as an admin', (done) => {
    req.body.userId = 'another@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(mock);
    memberFindStub = sinon.stub(Member, 'findOne').resolves(true);
    deleteStub = sinon.stub(Member, 'deleteOne').resolves();

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.findOne, member);
          sinon.assert.calledWith(Member.deleteOne, member);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is trying to remove itself as a member', (done) => {
    req.body.userId = 'member@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(mock);
    memberFindStub = sinon.stub(Member, 'findOne').resolves(true);
    deleteStub = sinon.stub(Member, 'deleteOne').resolves();

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.findOne, member);
          sinon.assert.calledWith(Member.deleteOne, member);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });
});