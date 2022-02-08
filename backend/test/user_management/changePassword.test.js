const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');
const { passwordErrorMessage } = require('convos-validator');
const { hashPassword } = require('../../utils/hashPassword')

describe('Change Password', () => {
  let req, findStub, updateStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    findStub.restore();
    updateStub.restore();
  });

  it('successfully updated password', () => {
    req.body = {
      oldPassword: 'pass1234',
      newPassword: 'pass123' 
    };
    req.session._id = 'example@email.com';
    const user = {
      _id: req.session._id,
      ...hashPassword(req.body.oldPassword)
    };
    findStub = sinon.stub(mongoose.Model, 'findById').yields(null, user);

    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
      }
    };

    ctrl.changePassword(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
    sinon.assert.calledOnce(User.updateOne);
  });

  it('failed to update password', () => {
    req.body = {
      oldPassword: 'pass1234',
      newPassword: 'pass123' 
    };
    req.session._id = 'example@email.com';
    const user = {
      _id: req.session._id,
      ...hashPassword(req.body.oldPassword)
    };
    findStub = sinon.stub(mongoose.Model, 'findById').yields(null, user);

    const mock = Promise.reject();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.changePassword(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
    sinon.assert.calledOnce(User.updateOne);
  });

  it('encountered errors finding user', () => {
    req.body = {
      oldPassword: 'pass1234',
      newPassword: 'pass123' 
    };
    req.session._id = 'example@email.com';
    const error = new Error();
    findStub = sinon.stub(mongoose.Model, 'findById').yields(error, null);

    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        expect(result.old).toBe(error);
      }
    };

    ctrl.changePassword(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
    sinon.assert.notCalled(User.updateOne);
  });

  it('has an incorrect old password', () => {
    req.body = {
      oldPassword: 'pass1234',
      newPassword: 'pass123' 
    };
    req.session._id = 'example@email.com';
    const user = {
      _id: req.session._id,
      ...hashPassword(req.body.newPassword)
    };
    findStub = sinon.stub(mongoose.Model, 'findById').yields(null, user);

    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        expect(result.old).toBe('Invalid password');
      }
    };

    ctrl.changePassword(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
    sinon.assert.notCalled(User.updateOne);
  });

  it('has an invalid new password', () => {
    req.body = {
      oldPassword: 'pass1234',
      newPassword: 'invalid' 
    };
    req.session._id = 'example@email.com';
    const user = {
      _id: req.session._id,
      ...hashPassword(req.body.oldPassword)
    };
    findStub = sinon.stub(mongoose.Model, 'findById').yields(null, user);

    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        expect(result.new).toBe(passwordErrorMessage);
      }
    };

    ctrl.changePassword(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
    sinon.assert.notCalled(User.updateOne);
  });
});