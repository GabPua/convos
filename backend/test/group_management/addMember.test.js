const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Add Member', () => {
  let req, findStub, updateStub;

  beforeEach(() => {
    req = {
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    findStub.restore();
    updateStub.restore();
  });

  it('encountered an error in updating user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const error = new Error();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').throws(error);
    findStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          sinon.assert.notCalled(Group.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('did not update any user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const mock = { exec: () => { return { modifiedCount: 0 }; } };
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);
    findStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe('An error has occured!');
          sinon.assert.notCalled(Group.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('successfully added a user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const updateMock = { exec: () => { return { modifiedCount: 1 }; } };
    const findMock = {
      lean: () => {
        return {
          exec: () => { return null; }
        };
      }
    };
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(updateMock);
    findStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(findMock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(Group.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });
});