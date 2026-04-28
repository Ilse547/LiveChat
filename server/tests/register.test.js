const request = require('supertest');
jest.mock('../models/user', () => {
  const MockSave = jest.fn().mockResolvedValue(true);
  const MockUserModel = jest.fn().mockImplementation(() => ({
    save: MockSave,
  }));
  MockUserModel.findOne = jest.fn();
  return MockUserModel;
});

jest.mock('mongoose', () => ({
  connect : jest.fn().mockResolvedValue(true),
  Schema: jest.fn().mockImplementation(() => ({})),
  model: jest.fn().mockReturnValue({})
}));
jest.mock('../service/email', () => ({
  SendConfirmationEmail: jest.fn().mockResolvedValue(true)
}));

const app = require ('../app');
const UserModel = require('../models/user');
describe('POST /register', () => {
  it('should reject if username is already takes', async() => {
    UserModel.findOne.mockResolvedValue({ username : 'www'});
    const res = await request(app)
      .post('/register')
      .send({Username : 'www',Email:'www@iamcool.com', Password : 'Password123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('This Username is already taken');
  });
  it('Should return 400 if email is already used', async () => {
    UserModel.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ email: 'www@iamcool.com'});
    const res = await request(app)
      .post('/register')
      .send({ Username: 'User', Email: 'www@iamcool.com', Password: 'Password123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email is already in use');
  })

  it('should return 200 when registering a new user', async() => {
    UserModel.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post('/register')
      .send({Username : 'xxx',Email:'xxx@test.com', Password : 'Password123'});
    expect(res.status).toBe(200);
  });
});