const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Create Group', () => {
  let req, createStub, updateStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    createStub.restore();
    updateStub.restore();
  });

  it('successfully created group', (done) => {
    req.body = {
      name: 'group',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';
    const group = {
      _id: '4eb6e7e7e9b7f4194e000001',
      name: req.body.name,
      admin: req.session._id,
      members: [req.session._id],
      invitations: [],
      tag: req.body.tag
    };
    createStub = sinon.stub(mongoose.Model, 'create').yields(null, group);
    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(group._id);
          sinon.assert.calledOnce(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.createGroup(req, res);

    sinon.assert.calledOnce(Group.create);
  });

  it('encountered an error in creating a group', (done) => {
    req.body = {
      name: 'group',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';

    const error = new Error();
    createStub = sinon.stub(mongoose.Model, 'create').yields(error, null);
    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result.err).toBe(error);
          sinon.assert.notCalled(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.createGroup(req, res);

    sinon.assert.calledOnce(Group.create);
  });

  it('does not have a valid group name', (done) => {
    req.body = {
      name: '',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';

    createStub = sinon.stub(mongoose.Model, 'create').yields(null);
    const mock = Promise.resolve();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(mock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          sinon.assert.notCalled(User.updateOne);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.createGroup(req, res);

    sinon.assert.notCalled(Group.create);
  });
});