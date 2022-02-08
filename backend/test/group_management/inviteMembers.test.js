const sinon = require('sinon');
const Group = require('../../group_management/group');
const Member = require('../../group_management/member');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Invite Members', () => {
  let req, findStub, updateStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    findStub.restore();
    updateStub.restore();
  });

  it('encountered an error in inviting users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const error = new Error();
    findStub = sinon.stub(Group, 'findById').throws(error);
    updateStub = sinon.stub(Member, 'bulkWrite');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err).toBe(error);
          sinon.assert.notCalled(Member.bulkWrite);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('is not the group admin that is logged in', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => {
            return { admin: 'admin@email.com' };
          }
        };
      }
    };
    findStub = sinon.stub(Group, 'findById').returns(mock);
    updateStub = sinon.stub(Member, 'bulkWrite');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('Current user is unauthorized!');
          sinon.assert.notCalled(Member.bulkWrite);
          done();
        } catch (error) {
          done(error);
        }
      },

      status: (result) => {
        expect(result).toBe(401);
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('did not invite any users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const groupId = req.params.id;
    const mock = {
      lean: () => {
        return {
          exec: () => {
            return { admin: 'admin@email.com' };
          }
        };
      }
    };
    const bulkOp = req.body.userIds.map(id => {
      return {
        updateOne: {
          filter: { group: groupId, user: id },
          update: { $setOnInsert: { group: groupId, user: id, accepted: false } },
          upsert: true,
        }
      };
    });
    findStub = sinon.stub(Group, 'findById').returns(mock);
    updateStub = sinon.stub(Member, 'bulkWrite').resolves({ ok: 0 });

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err.message).toBe('No users were invited!');
          sinon.assert.calledWith(Member.bulkWrite, bulkOp);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });

  it('successfully invited several users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const groupId = req.params.id;
    const mock = {
      lean: () => {
        return {
          exec: () => {
            return { admin: 'admin@email.com' };
          }
        };
      }
    };
    const bulkOp = req.body.userIds.map(id => {
      return {
        updateOne: {
          filter: { group: groupId, user: id },
          update: { $setOnInsert: { group: groupId, user: id, accepted: false } },
          upsert: true,
        }
      };
    });
    findStub = sinon.stub(Group, 'findById').returns(mock);
    updateStub = sinon.stub(Member, 'bulkWrite').resolves({ ok: 2 });

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledWith(Member.bulkWrite, bulkOp);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'admin');
  });
});