const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/group', () => {
	const MockGroupModel = jest.fn().mockImplementation(() => ({}));
	MockGroupModel.findOne = jest.fn();
	return MockGroupModel;
});