const request = require('supertest');
jest.mock('../models/user', () => {
	const MockUserModel = jest.fn().mockImplementation(() => ({}));
	MockUserModel.findOne = jest.fn();
	return MockUserModel;
});

jest.mock('mongoose', () => ({
	connect: jest.fn().mockResolvedValue(true),
  Schema: jest.fn().mockImplementation(() => ({})),
  model: jest.fn().mockReturnValue({})
}));

jest.mock('../service/email', () => ({
  SendConfirmationEmail: jest.fn().mockResolvedValue(true),
  SendLoginEmail: jest.fn().mockResolvedValue(true)
}));
jest.mock('express-mongo-sanitize', () => { return () => (req, res, next) => next(); });


process.env.JWT_KEY = 'TESTKEY';
const app = require('../app');
const UserModel = require('../models/user');

describe('POST /login', () => {
  it('should return 401 if the User does not exist', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post('/login')
      .send({ Username: 'username', Password: 'Password123'});
    expect(res.status).toBe(401);
  });
  it('Should return 401 if the password is wrong', async () =>{
    UserModel.findOne.mockResolvedValue({
      Username: 'www',
      isConfirmed: true,
      _id: '111',
      ComparePassword: jest.fn().mockResolvedValue(false)
    });
    const res = await request(app)
      .post('/login')
      .send({ Username:'www',Email: 'www@iamcool.com', Password: 'Password123'});
    expect(res.status).toBe(401);
  });
  it('should return 209 and the token when a user logs in', async () => {
    UserModel.findOne.mockResolvedValue({
      Username: 'www',
      email: 'www@iamcool.com',
      isConfirmed : true,
      _id: '111',
      ComparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    });
    const res = await request(app)
      .post('/login')
      .send({ Username: 'www',Email: 'www@iamcool.com', Password:'Password123'});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Code sent to your email');
  });
});
