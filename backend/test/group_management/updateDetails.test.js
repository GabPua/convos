const sinon = require('sinon');
const Group = require('../../group_management/group');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');
const { groupNameErrorMessage } = require('convos-validator');

describe('Update Details', () => {
  let req, updateStub;

  afterEach(() => {
    updateStub.restore();
  });

  it('encountered an error in updating group details', () => {
    req = {
      body: { coverUri: 'sample' },
      params: { id: '4eb6e7e7e9b7f4194e000001' },
      session: { _id: 'example@email.com' }
    };

    const error = new Error();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(error);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.updateDetails(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });

  it('successfully changed group coverUri', () => {
    req = {
      body: { coverUri: 'sample' },
      params: { id: '4eb6e7e7e9b7f4194e000001' },
      session: { _id: 'example@email.com' }
    };

    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
      }
    };

    ctrl.updateDetails(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });

  it('successfully changed group picUri', () => {
    req = {
      body: { picUri: 'sample' },
      params: { id: '4eb6e7e7e9b7f4194e000001' },
      session: { _id: 'example@email.com' }
    };

    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
      }
    };

    ctrl.updateDetails(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });

  it('successfully changed group name', () => {
    req = {
      body: { name: 'group' },
      params: { id: '4eb6e7e7e9b7f4194e000001' },
      session: { _id: 'example@email.com' }
    };

    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
      }
    };

    ctrl.updateDetails(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });

  it('does not have a valid group name', () => {
    req = {
      body: { name: '' },
      params: { id: '4eb6e7e7e9b7f4194e000001' },
      session: { _id: 'example@email.com' }
    };

    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe(groupNameErrorMessage);
      }
    };

    ctrl.updateDetails(req, res);

    sinon.assert.notCalled(Group.updateOne);
  });
});