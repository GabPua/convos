const sinon = require('sinon');
const Convo = require('../../convo_management/convo');
const Group = require('../../group_management/group');
const ctrl = require('../../convo_management/convo_ctrl');

describe('Join Convo', () => {
  let req, convoFindStub, groupFindStub, updateStub;

  beforeEach(() => {
    req = {
      params: {},
      session: {}
    };
  });

  afterEach(() => {
    convoFindStub.restore();
    groupFindStub.restore();
    updateStub.restore();
  });

  it('encountered an error in joining a convo', (done) => {
    req.params.convoId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const error = new Error();
    convoFindStub = sinon.stub(Convo, 'findById').throws(error);
    groupFindStub = sinon.stub(Group, 'findOne');
    updateStub = sinon.stub(Convo, 'findByIdAndUpdate');

    const res = {
      json: (result) => {
        try {
          expect(result.err).toBe(error);
          sinon.assert.notCalled(Group.findOne);
          sinon.assert.notCalled(Convo.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.joinConvo(req, res);

    sinon.assert.calledWith(Convo.findById, req.params.convoId, '-_id group');
  });

  it('did not find a group', (done) => {
    req.params.convoId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const groupId = '4eb6e7e7e9b7f4194e000002';

    const convoFindMock = {
      lean: () => {
        return {
          exec: () => {
            return { group: groupId };
          }
        };
      }
    };
    const groupFindMock = {
      lean: () => {
        return {
          exec: () => {
            return null;
          }
        };
      }
    };
    convoFindStub = sinon.stub(Convo, 'findById').returns(convoFindMock);
    groupFindStub = sinon.stub(Group, 'findOne').returns(groupFindMock);
    updateStub = sinon.stub(Convo, 'findByIdAndUpdate');

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(false);
          expect(result.err).toBe('User not part of group!');
          sinon.assert.calledWith(Group.findOne, { _id: groupId, users: req.session._id });
          sinon.assert.notCalled(Convo.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.joinConvo(req, res);

    sinon.assert.calledWith(Convo.findById, req.params.convoId, '-_id group');
  });

  it('successfully joined a convo', (done) => {
    req.params.convoId = '4eb6e7e7e9b7f4194e000001';
    req.session._id = 'example@email.com';
    const groupId = '4eb6e7e7e9b7f4194e000002';

    const convoFindMock = {
      lean: () => {
        return {
          exec: () => {
            return { group: groupId };
          }
        };
      }
    };
    const groupFindMock = {
      lean: () => {
        return {
          exec: () => {
            return { _id: groupId };
          }
        };
      }
    };
    const updateMock = {
      lean: () => {
        return {
          exec: () => {
            return { count: 1 };
          }
        };
      }
    };
    convoFindStub = sinon.stub(Convo, 'findById').returns(convoFindMock);
    groupFindStub = sinon.stub(Group, 'findOne').returns(groupFindMock);
    updateStub = sinon.stub(Convo, 'findByIdAndUpdate').returns(updateMock);

    const res = {
      json: (result) => {
        try {
          expect(result.result).toBe(true);
          expect(result.count).toBe(1);
          sinon.assert.calledWith(Group.findOne, { _id: groupId, users: req.session._id });
          sinon.assert.calledOnce(Convo.findByIdAndUpdate);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    ctrl.joinConvo(req, res);

    sinon.assert.calledWith(Convo.findById, req.params.convoId, '-_id group');
  });
});