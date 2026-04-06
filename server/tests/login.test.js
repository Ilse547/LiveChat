const request = require('supertest');
jest.mock('../models/user', () => {
	const MockUserModel = jest.fn().mockImplementation(() => ({}));
	MockUserModel.findOne = jest.fn();
	return MockUserModel;
});

jest.mock('mongoose', () => ({
	connect: jest.fn().mockResolvedValue(true)
}));
const app = require('../app');
const UserModel = require('../models/user');

describe('POST /login', () => {
  it('should return 401 if user doesnt exist', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post('/login')
      .send({ Username: 'username', Password: 'Password123'});
    expect(res.status).toBe(401);
  });
  it('Shoould return 401 if password is wrong', async () =>{
    UserModel.findOne.mockResolvedValue({
      Username: 'www',
      _id: '111',
      admin: false,
      ComparePassword: jest.fn().mockResolvedValue(false)
    });
    const res = await request(app)
      .post('/login')
      .send({ Username:'www', Password: 'Password123'});
    expect(res.status).toBe(401);
  });
  it('should return 29´9 and token when login', async () => {
    UserModel.findOne.mockResolvedValue({
      Username: 'www',
      _id: '111',
      admin: false,
      ComparePassword: jest.fn().mockResolvedValue(true),
    });
    const res = await request(app)
      .post('/login')
      .send({ Username: 'www', Password:'Password123'});
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
