const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { VerifyToken } = require('../middleware/verifytoken');

process.env.JWT_KEY = 'test_secret';

describe('VerifyToken Middleware', () => {

  it('should call next() when a valid token is provided', (done) => {
    const token = jwt.sign({ id: 1, username: 'alice' }, process.env.JWT_KEY);
    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer ${token}` }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn(() => {
      expect(req.user).toBeDefined();
      expect(req.user.username).toBe('alice');
      done();
    });
    VerifyToken(req, res, next);
  });

  it('should return 403 when no authorization header is provided', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
    VerifyToken(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: 'token not provided ???' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when an invalid token is provided', (done) => {
    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalidtoken123' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    res.json = jest.fn((data) => {
      expect(res.statusCode).toBe(403);
      expect(data).toEqual({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
      done();
    });
    VerifyToken(req, res, next);
  });

  it('should return 403 when an expired token is provided', (done) => {
    const token = jwt.sign(
      { id: 1, username: 'alice' },
      process.env.JWT_KEY,
      { expiresIn: '-1s' }
    );
    const req = httpMocks.createRequest({
      headers: { authorization: `Bearer ${token}` }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    res.json = jest.fn((data) => {
      expect(res.statusCode).toBe(403);
      expect(data).toEqual({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
      done();
    });
    VerifyToken(req, res, next);
  });

});
