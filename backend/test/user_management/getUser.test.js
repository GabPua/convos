const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Get User', () => {
  let stub;

  afterEach(() => {
    stub.restore();
  });

  it('has a valid session id', (done) => {
    const req = {
      session: { _id: 'example@email.com' }
    }
    const user = {
      _id: req.session._id,
      name: 'example',
      dpUri: 'sampleUri'
    };
    const mock = { exec: () => { return user; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result._id).toBe(req.session._id);
          expect(result.name).toBe(user.name);
          expect(result.dpUri).toBe(user.dpUri);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.getUser(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
  });

  it('does not have a valid session id', (done) => {
    const req = {
      session: { _id: 'example@email.com' }
    }
    const mock = { exec: () => { return null; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(Object.keys(result).length).toBe(0);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.getUser(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
  });

  it('does not have a session id', (done) => {
    const req = {
      session: {}
    }
    const mock = { exec: () => { return null; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(Object.keys(result).length).toBe(0);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.getUser(req, res);

    sinon.assert.calledWith(User.findById, req.session._id);
  });
});