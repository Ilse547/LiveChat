const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/group', () => {
	const MockGroupModel = jest.fn().mockImplementation(() => ({}));
	MockGroupModel.findOne = jest.fn();
	return MockGroupModel;
});

jest.mock('../models/user', () => {
	const MockUserModel = jest.fn().mockImplementation(()=> ({}));
	MockUserModel.findOne = jest.fn();
	return MockUserModel;
});