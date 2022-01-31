const sinon = require('sinon');
const Group = require('../../group_management/group');
const User = require('../../user_management/user');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Update Pic', () => {
  let req, updateStub;

  afterEach(() => {
    updateStub.restore();
  });

  it('successfully changed group picUri', () => {
    req = {
      body: { picUri: 'sample' },
      params: { id: '4eb6e7e7e9b7f4194e000001' }
    };

    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(null);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
      }
    };

    ctrl.updatePic(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });

  it('encountered an error in changing group picUri', () => {
    req = {
      body: { picUri: 'sample' },
      params: { id: '4eb6e7e7e9b7f4194e000001' }
    };

    const error = new Error();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').yields(error);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.updatePic(req, res);

    sinon.assert.calledOnce(Group.updateOne);
  });
});