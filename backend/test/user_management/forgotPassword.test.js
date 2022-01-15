const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Forgot Password', () => {
  let stub;

  afterEach(() => {
    stub.restore();
  });

  it('successfully updated password', (done) => {
    const req = {
      body: { 
        _id: 'example@email.com',
        password: 'pass1234' 
      }
    }
    const mock = Promise.resolve();
    stub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

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

    ctrl.forgotPassword(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('failed to updated password', (done) => {
    const req = {
      body: { 
        _id: 'example@email.com',
        password: 'pass1234' 
      }
    }
    const mock = Promise.reject();
    stub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.forgotPassword(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });
});