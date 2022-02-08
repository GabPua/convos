const sinon = require('sinon');
const User = require('../../user_management/user');
const Token = require('../../forgot_password/token');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Forgot Password', () => {
  let updateStub, deleteStub;

  afterEach(() => {
    updateStub.restore();
    deleteStub.restore();
  });

  it('successfully updated password', () => {
    const req = {
      body: { 
        _id: 'example@email.com',
        password: 'pass1234' 
      }
    }
    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);
    deleteStub = sinon.stub(mongoose.Model, 'deleteOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
        sinon.assert.calledOnce(Token.deleteOne);
      }
    };

    ctrl.forgotPassword(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('failed to updated password', () => {
    const req = {
      body: { 
        _id: 'example@email.com',
        password: 'pass1234' 
      }
    }
    const mock = Promise.reject();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);
    deleteStub = sinon.stub(mongoose.Model, 'deleteOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
        sinon.assert.notCalled(Token.deleteOne);
      }
    };

    ctrl.forgotPassword(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });
});