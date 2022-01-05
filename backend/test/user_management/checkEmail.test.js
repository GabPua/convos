const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Check Email', () => {
  const req = {
    query: {
      _id: "example@email.com"
    }
  };
  let stub;

  afterEach(() => {
    stub.restore();
  });

  it('is a unique email', (done) => {
    // findById returns null
    const mock = { exec: () => { return null; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const expectedResult = true;
    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(expectedResult);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.checkEmail(req, res);

    sinon.assert.calledWith(User.findById, decodeURIComponent(req.query._id));
  });

  it('is not a unique email', (done) => {
    // findById returns a document
    const user = {
      _id: req.query._id,
      name: "example"
    };
    const mock = { exec: () => { return user; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const expectedResult = false;
    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(expectedResult);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.checkEmail(req, res);

    sinon.assert.calledWith(User.findById, decodeURIComponent(req.query._id));
  });
});