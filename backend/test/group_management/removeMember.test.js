const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Remove Member', () => {
  let req, findStub, groupUpdateStub, userUpdateStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    findStub.restore();
    groupUpdateStub.restore();
    userUpdateStub.restore();
  });

  it('encountered an error in finding group', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const error = new Error();
    findStub = sinon.stub(mongoose.Model, 'findOne').throws(error);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.notCalled(Group.updateOne);
          sinon.assert.notCalled(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledOnce(Group.findOne);
  });

  it('did not find the group', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => { return null; }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findOne').returns(findMock);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('Unauthorized');
          sinon.assert.notCalled(Group.updateOne);
          sinon.assert.notCalled(User.updateOne);
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

    sinon.assert.calledOnce(Group.findOne);
  });

  it('is trying to remove the admin', (done) => {
    req.body.userId = 'admin@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findOne').returns(findMock);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('Unauthorized');
          sinon.assert.notCalled(Group.updateOne);
          sinon.assert.notCalled(User.updateOne);
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

    sinon.assert.calledOnce(Group.findOne);
  });

  it('is trying to remove another member as a member', (done) => {
    req.body.userId = 'another@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findOne').returns(findMock);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('Unauthorized');
          sinon.assert.notCalled(Group.updateOne);
          sinon.assert.notCalled(User.updateOne);
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

    sinon.assert.calledOnce(Group.findOne);
  });

  it('is trying to remove another member as an admin', (done) => {
    req.body.userId = 'another@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'admin@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findOne').returns(findMock);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(Group.updateOne);
          sinon.assert.calledOnce(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledOnce(Group.findOne);
  });

  it('is trying to remove itself as a member', (done) => {
    req.body.userId = 'member@email.com';
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'member@email.com';
    
    const findMock = {
      lean: () => {
        return {
          exec: () => { return { admin: 'admin@email.com' }; }
        };
      }
    };
    findStub = sinon.stub(mongoose.Model, 'findOne').returns(findMock);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(Group.updateOne);
          sinon.assert.calledOnce(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.removeMember(req, res);

    sinon.assert.calledOnce(Group.findOne);
  });
});