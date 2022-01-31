const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const ctrl = require('../../user_management/user_ctrl');

describe('Reject Invitation', () => {
  let req, groupUpdateStub, userUpdateStub;

  beforeEach(() => {
    req = {
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    groupUpdateStub.restore();
    userUpdateStub.restore();
  });

  it('encountered an error in updating user', (done) => {
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const error = new Error();
    userUpdateStub = sinon.stub(User, 'updateOne').throws(error);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.notCalled(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.rejectInvitation(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('encountered an error in updating group', (done) => {
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const error = new Error();
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);
    groupUpdateStub = sinon.stub(Group, 'updateOne').throws(error);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.calledOnce(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.rejectInvitation(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('successfully removed the invite', (done) => {
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    userUpdateStub = sinon.stub(User, 'updateOne').returns(null);
    groupUpdateStub = sinon.stub(Group, 'updateOne').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(Group.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.rejectInvitation(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });
});