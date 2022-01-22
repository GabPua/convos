const sinon = require('sinon');
const User = require('../../user_management/user');
const Contact = require('../../contact_management/contact');
const mongoose = require('mongoose');
const ctrl = require('../../contact_management/contact_ctrl');

describe('Add Contact', () => {
  let req, findUserStub, findContactStub, createStub;

  beforeEach(() => {
    req = {
      body: {},
      session: {}
    };
  });

  afterEach(() => {
    findUserStub.restore();
    findContactStub.restore();
    createStub.restore();
  });

  it('is adding himself as contact', () => {
    req.body.contactId = 'example@email.com';
    req.session._id = 'example@email.com';

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(null);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(null);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe('You cannot add yourself!');
        sinon.assert.notCalled(Contact.findOne);
        sinon.assert.notCalled(Contact.create);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.notCalled(User.findById);
  });

  it('encounters an error in finding a user', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const error = new Error();

    findUserStub = sinon.stub(mongoose.Model, 'findById').throws(error);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(null);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe(error);
        sinon.assert.notCalled(Contact.findOne);
        sinon.assert.notCalled(Contact.create);
      },

      status: (result) => {
        expect(result).toBe(500);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });

  it('is adding a nonexistent user as contact', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const mock = { exec: () => { return null; } };

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(mock);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(null);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe('User does not exist!');
        sinon.assert.notCalled(Contact.findOne);
        sinon.assert.notCalled(Contact.create);
      },

      status: (result) => {
        expect(result).toBe(400);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });

  it('encounters an error in finding a contact', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const contact = {
      userId: req.session._id,
      contactId: req.body.contactId
    };
    const mock = { exec: () => { return 'not null'; } };
    const error = new Error();

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(mock);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').throws(error);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe(error);
        sinon.assert.calledWith(Contact.findOne, contact);
        sinon.assert.notCalled(Contact.create);
      },

      status: (result) => {
        expect(result).toBe(500);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });

  it('is adding a user that is already a contact', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const contact = {
      userId: req.session._id,
      contactId: req.body.contactId
    };
    const userMock = { exec: () => { return 'not null'; } };
    const contactMock = { exec: () => { return 'already contact'; } };

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(userMock);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(contactMock);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.err).toBe('User is already in contacts!');
        sinon.assert.calledWith(Contact.findOne, contact);
        sinon.assert.notCalled(Contact.create);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });

  it('encounters an error in creating a contact', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const contact = {
      userId: req.session._id,
      contactId: req.body.contactId
    };
    const userMock = { exec: () => { return { _id: 'another@email.com' }; } };
    const contactMock = { exec: () => { return null; } };
    const error = new Error();

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(userMock);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(contactMock);
    createStub = sinon.stub(mongoose.Model, 'create').throws(error);

    const res = {
      json: (result) => {
        expect(result.err).toBe(error);
        sinon.assert.calledWith(Contact.findOne, contact);
        sinon.assert.calledWith(Contact.create, contact);
      },

      status: (result) => {
        expect(result).toBe(500);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });

  it('successfully adds a contact', () => {
    req.body.contactId = 'another@email.com';
    req.session._id = 'example@email.com';

    const contact = {
      userId: req.session._id,
      contactId: req.body.contactId
    };
    const user = { _id: 'another@email.com' };
    const userMock = { exec: () => { return user; } };
    const contactMock = { exec: () => { return null; } };
    const error = new Error();

    findUserStub = sinon.stub(mongoose.Model, 'findById').returns(userMock);
    findContactStub = sinon.stub(mongoose.Model, 'findOne').returns(contactMock);
    createStub = sinon.stub(mongoose.Model, 'create').returns(null);

    const res = {
      json: (result) => {
        expect(result.user).toBe(user);
        sinon.assert.calledWith(Contact.findOne, contact);
        sinon.assert.calledWith(Contact.create, contact);
      }
    };

    ctrl.addContact(req, res);

    sinon.assert.calledWith(User.findById, req.body.contactId);
  });
});