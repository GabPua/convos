const sinon = require('sinon');
const Token = require('../../forgot_password/token');
const mongoose = require('mongoose');
const ctrl = require('../../forgot_password/password_ctrl');
const util = require('../../utils/email/sendEmail');

describe('Request Password Reset', () => {
  let req, deleteStub, createStub, utilStub;

  afterEach(() => {
    deleteStub.restore();
    createStub.restore();
    utilStub.restore();
  });

  it('successfully requested for password reset', () => {
    req = {
      query: { _id: 'example@email.com' }
    };

    deleteStub = sinon.stub(mongoose.Model, 'findOneAndDelete').yields(null);
    createStub = sinon.stub(mongoose.Model, 'create').yields(null, req.query);
    utilStub = sinon.stub(util, 'sendPasswordReset').returns(Promise.resolve());

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
        sinon.assert.calledOnce(Token.create);
        sinon.assert.calledOnce(util.sendPasswordReset);
      }
    };

    ctrl.requestPasswordReset(req, res);

    sinon.assert.calledWith(Token.findOneAndDelete, { userId: decodeURIComponent(req.query._id) });
  });

  it('was not successful in requesting for password reset', () => {
    req = {
      query: { _id: 'example@email.com' }
    };

    deleteStub = sinon.stub(mongoose.Model, 'findOneAndDelete').yields(null);
    createStub = sinon.stub(mongoose.Model, 'create').yields(new Error(), req.query);
    utilStub = sinon.stub(util, 'sendPasswordReset').returns(Promise.resolve());

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
        sinon.assert.calledOnce(Token.create);
        sinon.assert.notCalled(util.sendPasswordReset);
      }
    };

    ctrl.requestPasswordReset(req, res);

    sinon.assert.calledWith(Token.findOneAndDelete, { userId: decodeURIComponent(req.query._id) });
  });
});