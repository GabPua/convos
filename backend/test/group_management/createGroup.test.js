const sinon = require('sinon');
const Group = require('../../group_management/group');
const Member = require('../../group_management/member');
const ctrl = require('../../group_management/group_ctrl');
const mongoose = require('mongoose');

describe('Create Group', () => {
  let req, groupCreateStub, memberCreateStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    groupCreateStub.restore();
    memberCreateStub.restore();
  });

  it('successfully created group', (done) => {
    req.body = {
      name: 'group',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';
    const group = {
      name: req.body.name,
      admin: req.session._id,
      tag: req.body.tag
    };
    const groupId = '4eb6e7e7e9b7f4194e000001';
    const member = {
      group: groupId,
      user: req.session._id,
      accepted: true
    };
    groupCreateStub = sinon.stub(Group, 'create').resolves({ _id: groupId });
    memberCreateStub = sinon.stub(Member, 'create').resolves();

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(groupId);
          sinon.assert.calledWith(Member.create, member);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.createGroup(req, res);

    sinon.assert.calledWith(Group.create, group);
  });

  it('encountered an error in creating group', (done) => {
    req.body = {
      name: 'group',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';
    const group = {
      name: req.body.name,
      admin: req.session._id,
      tag: req.body.tag
    };
    const error = new Error();
    groupCreateStub = sinon.stub(Group, 'create').throws(error);
    memberCreateStub = sinon.stub(Member, 'create');

    const res = {
      json: (result) => {
        try {
          expect(result.err).toBe(error);
          sinon.assert.notCalled(Member.create);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.createGroup(req, res);

    sinon.assert.calledWith(Group.create, group);
  });

  it('does not have a valid group name', (done) => {
    req.body = {
      name: ' ',
      tag: 'social' 
    };
    req.session._id = 'example@email.com';
    
    groupCreateStub = sinon.stub(Group, 'create');
    memberCreateStub = sinon.stub(Member, 'create');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          sinon.assert.notCalled(Member.create);
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