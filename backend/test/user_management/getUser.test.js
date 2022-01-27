const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Get User', () => {
  let stub;

  afterEach(() => {
    stub.restore();
  });

  it('has a valid id parameter', (done) => {
    const req = {
      params: { id: 'example@email.com' }
    };
    const user = {
      _id: req.params.id,
      name: 'example',
      dpUri: 'sampleUri'
    };
    const mock = { exec: () => { return user; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result._id).toBe(req.params.id);
          expect(result.name).toBe(user.name);
          expect(result.dpUri).toBe(user.dpUri);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.getUser(req, res);

    sinon.assert.calledWith(User.findById, req.params.id);
  });

  it('does not have a valid id parameter but has a session id', (done) => {
    const req = {
      params: {},
      session: { _id: 'example@email.com' }
    };
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

  it('does not have a valid id parameter or a valid session id', (done) => {
    const req = {
      params: {},
      session: { _id: null }
    };
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

  it('does not have a valid id parameter or a session id', (done) => {
    const req = {
      params: {},
      session: {}
    };
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