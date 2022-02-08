const sinon = require('sinon');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../user_management/user_ctrl');

describe('Update Name', () => {
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

  it('successfully updated name', (done) => {
    req.session._id = 'example@email.com';
    req.body.name = 'example';
    stub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

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

    ctrl.updateName(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('failed to update name', (done) => {
    req.session._id = 'example@email.com';
    req.body.name = 'example';
    stub = sinon.stub(mongoose.Model, 'updateOne').yields(new Error());

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

    ctrl.updateName(req, res);

    sinon.assert.calledOnce(User.updateOne);
  });

  it('does not have a session id', () => {
    req.body.name = 'example';
    stub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe('Bad Request: No session or new name passed.');
      },
      status: (result) => {
        expect(result).toBe(400);
      }
    };

    ctrl.updateName(req, res);

    sinon.assert.notCalled(User.updateOne);
  });

  it('does not have a name', () => {
    req.session._id = 'example@email.com';
    stub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe('Bad Request: No session or new name passed.');
      },
      status: (result) => {
        expect(result).toBe(400);
      }
    };

    ctrl.updateName(req, res);

    sinon.assert.notCalled(User.updateOne);
  });
});