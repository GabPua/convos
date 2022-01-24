const sinon = require('sinon');
const Token = require('../../forgot_password/token');
const mongoose = require('mongoose');
const ctrl = require('../../forgot_password/password_ctrl');

describe('Check Token', () => {
  let req, stub;

  afterEach(() => {
    stub.restore();
  });

  it('is a valid token', () => {
    req = {
      query: { 
        id: '4eb6e7e7e9b7f4194e000001',
        token: 'token'
      }
    };

    const token = {
      userId: 'example@email.com',
      token: 'token'
    };
    const mock = { exec: () => { return Promise.resolve(token); } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(true);
        expect(result.email).toBe(token.userId);
      }
    };

    ctrl.checkToken(req, res);

    sinon.assert.calledWith(Token.findById, req.query.id);
  });

  it('does not have the same token string', () => {
    req = {
      query: { 
        id: '4eb6e7e7e9b7f4194e000001',
        token: 'toooken'
      }
    };

    const token = {
      userId: 'example@email.com',
      token: 'token'
    };
    const mock = { exec: () => { return Promise.resolve(token); } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.checkToken(req, res);

    sinon.assert.calledWith(Token.findById, req.query.id);
  });

  it('does not have a returned token', () => {
    req = {
      query: { 
        id: '4eb6e7e7e9b7f4194e000001',
        token: 'toooken'
      }
    };

    const mock = { exec: () => { return Promise.resolve(null); } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.checkToken(req, res);

    sinon.assert.calledWith(Token.findById, req.query.id);
  });

  it('does not have a valid id', () => {
    req = {
      query: { 
        id: 'invalid',
        token: 'toooken'
      }
    };

    const mock = { exec: () => { return Promise.resolve(null); } };
    stub = sinon.stub(mongoose.Model, 'findById').returns(mock);

    const res = {
      json: (result) => {
        expect(result.result).toBe(false);
      }
    };

    ctrl.checkToken(req, res);

    sinon.assert.notCalled(Token.findById);
  });
});