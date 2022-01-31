const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Invite Members', () => {
  let req, findStub, updateManyStub, updateOneStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    findStub.restore();
    updateManyStub.restore();
    updateOneStub.restore();
  });

  it('encountered an error in finding group', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const error = new Error();
    findStub = sinon.stub(mongoose.Model, 'findById').throws(error);
    updateManyStub = sinon.stub(mongoose.Model, 'updateMany').returns(null);
    updateOneStub = sinon.stub(mongoose.Model, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err).toBe(error);
          sinon.assert.notCalled(User.updateMany);
          sinon.assert.notCalled(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'members admin');
  });

  it('is not the group admin that is logged in', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => {
            return {
              members: [],
              admin: 'admin@email.com'
            };
          }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findById').returns(mock);
    updateManyStub = sinon.stub(mongoose.Model, 'updateMany').returns(null);
    updateOneStub = sinon.stub(mongoose.Model, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('Current user is unauthorized!');
          sinon.assert.notCalled(User.updateMany);
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

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'members admin');
  });

  it('encountered an error in updating users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const mock = {
      lean: () => {
        return {
          exec: () => {
            return {
              members: [],
              admin: 'admin@email.com'
            };
          }
        };
      }
    };
    const error = new Error();
    findStub = sinon.stub(mongoose.Model, 'findById').returns(mock);
    updateManyStub = sinon.stub(mongoose.Model, 'updateMany').throws(error);
    updateOneStub = sinon.stub(mongoose.Model, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err).toBe(error);
          sinon.assert.calledOnce(User.updateMany);
          sinon.assert.notCalled(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'members admin');
  });

  it('did not update any users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => {
            return {
              members: ['example@email.com', 'another@email.com'],
              admin: 'admin@email.com'
            };
          }
        };
      }
    };
    const updateMock = { exec: () => { return { matchedCount: 0 }; } };
    findStub = sinon.stub(mongoose.Model, 'findById').returns(findMock);
    updateManyStub = sinon.stub(mongoose.Model, 'updateMany').returns(updateMock);
    updateOneStub = sinon.stub(mongoose.Model, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('No users were invited!');
          sinon.assert.calledOnce(User.updateMany);
          sinon.assert.notCalled(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'members admin');
  });

  it('successfully updated several users', (done) => {
    req.body.userIds = ['example@email.com', 'another@email.com'];
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => {
            return {
              members: [],
              admin: 'admin@email.com'
            };
          }
        };
      }
    };
    const updateMock = { exec: () => { return { matchedCount: 2 }; } };
    findStub = sinon.stub(mongoose.Model, 'findById').returns(findMock);
    updateManyStub = sinon.stub(mongoose.Model, 'updateMany').returns(updateMock);
    updateOneStub = sinon.stub(mongoose.Model, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(User.updateMany);
          sinon.assert.calledOnce(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.inviteMembers(req, res);

    sinon.assert.calledWith(Group.findById, req.params.id, 'members admin');
  });
});