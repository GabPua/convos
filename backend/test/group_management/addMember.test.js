const sinon = require('sinon');
const Member = require('../../group_management/member');
const mongoose = require('mongoose');
const ctrl = require('../../group_management/group_ctrl');

describe('Add Member', () => {
  let req, updateStub;

  beforeEach(() => {
    req = {
      session: {},
      params: {}
    };
  });

  afterEach(() => {
    updateStub.restore();
  });

  it('encountered an error in adding user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    const error = new Error();
    updateStub = sinon.stub(mongoose.Model, 'updateOne').throws(error);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error).toBe(error);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(Member.updateOne);
  });

  it('did not add any user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(Promise.resolve({ modifiedCount: 0 }));

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.error.message).toBe('An error has occured! No document was modified.');
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(Member.updateOne);
  });

  it('successfully added a user', (done) => {
    req.params.id = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    
    updateStub = sinon.stub(mongoose.Model, 'updateOne').returns(Promise.resolve({ modifiedCount: 1 }));

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

    ctrl.addMember(req, res);

    sinon.assert.calledOnce(Member.updateOne);
  });
});