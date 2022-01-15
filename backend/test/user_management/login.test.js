const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');
const { hashPassword } = require('../../utils/hashPassword');

describe('Login', () => {
  let req, stub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    stub.restore();
  });

  it('has valid credentials', (done) => {
    req.body = {
      _id: 'example@email.com',
      password: 'pass1234'
    };
    const user = {
      _id: req.body._id,
      name: 'example',
      ...hashPassword(req.body.password),
      dpUri: 'sampleUri'
    };
    const mock = { exec: () => { return user; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      status: (result) => {
        expect(result).toBe(200);
      },

      json: (result) => {
        try {
          expect(result._id).toBe(req.body._id);
          expect(result.name).toBe(user.name);
          expect(result.dpUri).toBe(user.dpUri);
          expect(req.session._id).toBe(req.body._id);
          expect(req.session.name).toBe(user.name);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.login(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });

  it('has incorrect password', (done) => {
    req.body = {
      _id: 'example@email.com',
      password: 'pass123'
    };
    const user = {
      _id: req.body._id,
      name: 'example',
      ...hashPassword('pass1234'),
      dpUri: 'sampleUri'
    };
    const mock = { exec: () => { return user; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      status: (result) => {
        expect(result).toBe(401);
      },

      json: (result) => {
        try {
          expect(Object.keys(result).length).toBe(0);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.login(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });

  it('has an unused email', (done) => {
    req.body = {
      _id: 'example@email.com',
      password: 'pass1234'
    };
    const mock = { exec: () => { return null; } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      status: (result) => {
        expect(result).toBe(401);
      },

      json: (result) => {
        try {
          expect(Object.keys(result).length).toBe(0);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.login(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });
});