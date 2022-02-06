const sinon = require('sinon');
const Convo = require('../../convo_management/convo');
const ctrl = require('../../convo_management/convo_ctrl');

describe('Start Convo', () => {
  let req, createStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      session: {}
    };
  });

  afterEach(() => {
    createStub.restore();
  });

  it('successfully started a convo', (done) => {
    req.body = {
      topic: 'convo',
      link: 'sample' 
    };
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const convo = {
      topic: req.body.topic,
      link: req.body.link,
      group: req.params.groupId,
      creator: req.session._id,
      users: []
    };
    createStub = sinon.stub(Convo, 'create').yields(null);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          expect(result.err).toBe(null);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.startConvo(req, res);

    sinon.assert.calledWith(Convo.create, convo);
  });

  it('encountered an error in starting a convo', (done) => {
    req.body = {
      topic: 'convo',
      link: 'sample' 
    };
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const convo = {
      topic: req.body.topic,
      link: req.body.link,
      group: req.params.groupId,
      creator: req.session._id,
      users: []
    };
    const error = new Error();
    createStub = sinon.stub(Convo, 'create').yields(error);

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

    ctrl.startConvo(req, res);

    sinon.assert.calledWith(Convo.create, convo);
  });

  it('does not have a valid topic name', (done) => {
    req.body = {
      topic: ' ',
      link: 'sample' 
    };
    req.params.groupId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    createStub = sinon.stub(Convo, 'create');

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

    ctrl.startConvo(req, res);

    sinon.assert.notCalled(Convo.create);
  });
});