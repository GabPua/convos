const sinon = require('sinon');
const Token = require('../../forgot_password/token');
const mongoose = require('mongoose');
const ctrl = require('../../forgot_password/password_ctrl');

describe('Request Password Reset', () => {
  let req, updateStub;

  afterEach(() => {
    updateStub.restore();
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

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
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

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
        expect(result.error).toBe(error);
      }
    };

    ctrl.requestPasswordReset(req, res);

    sinon.assert.calledWith(Token.findOneAndUpdate, { userId: decodeURIComponent(req.query._id) });
  });
});