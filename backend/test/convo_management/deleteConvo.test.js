const sinon = require('sinon');
const Convo = require('../../convo_management/convo');
const ctrl = require('../../convo_management/convo_ctrl');

describe('Delete Convo', () => {
  let req, deleteStub;

  beforeEach(() => {
    req = {
      params: {},
      session: {}
    };
  });

  afterEach(() => {
    deleteStub.restore();
  });

  it('encountered an error in deleting a convo', (done) => {
    req.params.convoId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const error = new Error();
    deleteStub = sinon.stub(Convo, 'deleteOne').throws(error);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err).toBe(error);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.deleteConvo(req, res);

    sinon.assert.calledWith(Convo.deleteOne, { _id: req.params.convoId, creator: req.session._id });
  });

  it('successfully deleted a convo', (done) => {
    req.params.convoId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    deleteStub = sinon.stub(Convo, 'deleteOne').resolves();

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

    ctrl.deleteConvo(req, res);

    sinon.assert.calledWith(Convo.deleteOne, { _id: req.params.convoId, creator: req.session._id });
  });
});