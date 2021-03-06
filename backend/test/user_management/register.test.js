const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');
const { matchPassword, hashPassword } = require('../../utils/hashPassword');

describe('Register', () => {
  let req, getStub, createStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    getStub.restore();
    createStub.restore();
  });

  it('has valid fields and a unique email', (done) => {
    req.body = {
      _id: 'example@email.com',
      name: 'example',
      password: 'pass1234'
    };
    const mock = { exec: () => { return null; } };
    getStub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const user = {
      _id: req.body._id,
      name: req.body.name,
      ...hashPassword(req.body.password)
    };

    createStub = sinon.stub(mongoose.Model, 'create').yields(null, user, user);

    const res = {
      send: (result) => {
        try {
          sinon.assert.calledOnce(User.create);

          expect(result.result._id).toBe(req.body._id);
          expect(result.result.name).toBe(req.body.name);
          expect(matchPassword(req.body.password, result.result.password, result.result.salt)).toBe(true);
          expect(req.session._id).toBe(req.body._id);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.register(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });

  it('has valid fields but not a unique email', (done) => {
    req.body = {
      _id: 'example@email.com',
      name: 'example',
      password: 'pass1234'
    };
    const mock = { exec: () => { return req.body; } };
    getStub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const user = {
      _id: req.body._id,
      name: req.body.name,
      ...hashPassword(req.body.password)
    };

    createStub = sinon.stub(mongoose.Model, 'create').yields(null, user, user);

    const res = {
      json: (result) => {
        try {
          sinon.assert.notCalled(User.create);

          expect(result.result).toBe(false);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.register(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });

  it('does not have valid fields but has a unique email', (done) => {
    req.body = {
      _id: 'example@email.com',
      name: 'example',
      password: 'invalid'
    };
    const mock = { exec: () => { return null; } };
    getStub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const user = {
      _id: req.body._id,
      name: req.body.name,
      ...hashPassword(req.body.password)
    };

    createStub = sinon.stub(mongoose.Model, 'create').yields(null, user, user);

    const res = {
      json: (result) => {
        try {
          sinon.assert.notCalled(User.create);

          expect(result.result).toBe(false);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.register(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });

  it('does not have valid fields or a unique email', (done) => {
    req.body = {
      _id: 'example@email.com',
      name: 'example',
      password: 'invalid'
    };
    const mock = { exec: () => { return req.body; } };
    getStub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const user = {
      _id: req.body._id,
      name: req.body.name,
      ...hashPassword(req.body.password)
    };

    createStub = sinon.stub(mongoose.Model, 'create').yields(null, user, user);

    const res = {
      json: (result) => {
        try {
          sinon.assert.notCalled(User.create);

          expect(result.result).toBe(false);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.register(req, res);

    sinon.assert.calledWith(User.findById, req.body._id);
  });
});