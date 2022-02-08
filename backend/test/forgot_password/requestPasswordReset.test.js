const sinon = require('sinon');
const Token = require('../../forgot_password/token');
const mongoose = require('mongoose');
const ctrl = require('../../forgot_password/password_ctrl');
const util = require('../../utils/email/sendEmail');

describe('Request Password Reset', () => {
  let req, updateStub, utilStub;

  afterEach(() => {
    updateStub.restore();
    utilStub.restore();
  });

  it('successfully requested for password reset', (done) => {
    req = {
      query: { _id: 'example@email.com' }
    };
    const token = {
      _id: '4eb6e7e7e9b7f4194e000001',
      token: 'token',
      userId: decodeURIComponent(req.query._id)
    };

    updateStub = sinon.stub(mongoose.Model, 'findOneAndUpdate').yields(null, token);
    utilStub = sinon.stub(util, 'sendPasswordReset').returns(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          sinon.assert.calledOnce(util.sendPasswordReset);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.requestPasswordReset(req, res);

    sinon.assert.calledWith(Token.findOneAndUpdate, { userId: decodeURIComponent(req.query._id) });
  });

  it('was not successful in requesting for password reset', () => {
    req = {
      query: { _id: 'example@email.com' }
    };
    const error = new Error();
    updateStub = sinon.stub(mongoose.Model, 'findOneAndUpdate').yields(error, null);
    utilStub = sinon.stub(util, 'sendPasswordReset').returns(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
        expect(result.error).toBe(error);
        sinon.assert.notCalled(util.sendPasswordReset);
      }
    };

    ctrl.requestPasswordReset(req, res);

    sinon.assert.calledWith(Token.findOneAndUpdate, { userId: decodeURIComponent(req.query._id) });
  });
});