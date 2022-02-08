const sinon = require('sinon');
const Group = require('../../group_management/group');
const Member = require('../../group_management/member');
const ctrl = require('../../group_management/group_ctrl');

describe('Remove Member', () => {
  let req, groupFindStub, memberFindStub, deleteStub, updateStub;

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
    updateStub.restore();
  });

  it('encountered an error in removing member', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const error = new Error();
    groupFindStub = sinon.stub(Group, 'findById').throws(error);
    memberFindStub = sinon.stub(Member, 'find');
    deleteStub = sinon.stub(Member, 'deleteOne');
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.notCalled(Member.find);
          sinon.assert.notCalled(Member.deleteOne);
          sinon.assert.notCalled(Group.updateOne);
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
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return null; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return []; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne');
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.notCalled(Member.deleteOne);
          sinon.assert.notCalled(Group.updateOne);
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
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return [{ user: req.body.userId }]; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne');
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.notCalled(Member.deleteOne);
          sinon.assert.notCalled(Group.updateOne);
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

  it('is trying to remove the admin without a new admin', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return [{ user: req.body.userId }]; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne');
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('Unauthorized!');
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.notCalled(Member.deleteOne);
          sinon.assert.notCalled(Group.updateOne);
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

  it('is trying to remove the admin with a new admin', (done) => {
    req.body.userId = 'admin@email.com';
    req.body.newAdmin = 'next@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return [{ user: req.body.userId }, { user: req.body.newAdmin }]; }
        };
      }
    };
    const mock = {
      lean: () => {
        return {
          exec: () => { return null; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    const deleteMember = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne').resolves();
    updateStub = sinon.stub(Group, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.calledWith(Member.deleteOne, deleteMember);
          sinon.assert.calledWith(Group.updateOne, { _id: req.params.id }, { admin: req.body.newAdmin });
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is trying to remove another member as an admin', (done) => {
    req.body.userId = 'another@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return [{ user: req.body.userId }]; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    const deleteMember = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne').resolves();
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.calledWith(Member.deleteOne, deleteMember);
          sinon.assert.notCalled(Group.updateOne);
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
    
    const groupMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    const memberMock = {
      lean: () => {
        return {
          exec: () => { return [{ user: req.body.userId }]; }
        };
      }
    };
    const member = {
      group: req.params.id,
      user: {
        $in: [req.body.userId, req.body.newAdmin]
      }
    };
    const deleteMember = {
      group: req.params.id,
      user: req.body.userId
    };
    groupFindStub = sinon.stub(Group, 'findById').returns(groupMock);
    memberFindStub = sinon.stub(Member, 'find').returns(memberMock);
    deleteStub = sinon.stub(Member, 'deleteOne').resolves();
    updateStub = sinon.stub(Group, 'updateOne');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.find, member);
          sinon.assert.calledWith(Member.deleteOne, deleteMember);
          sinon.assert.notCalled(Group.updateOne);
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