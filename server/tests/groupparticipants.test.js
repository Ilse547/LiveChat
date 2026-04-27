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

jest.mock('mongoose', ()=> ({
	connect: jest.fn().mockResolvedValue(true),
	schema: jest.fn().mockResolvedValue(() => ({})),
	model: jest.fn().mockReturnValue({})
}));

const app = require('../app');
const GroupModel = require('../models/group');

function CreateToken(username) {
	return jwt.sign({username, id: 'FakeId', admin: false}, process.env.JWT_KEY || 'SecretKeyTest');
}

describe('GET /groupinfo/:groupname', () => {
	it('should return 200 if user is participant of a group', async () =>{
		GroupModel.findOne.mockResolvedValue({
			GroupName: 'testgroup',
			Participants: ['John', 'Bob', 'Willian']
		});
		const token = CreateToken('William');
		const res = await request(app)
			.get('/groupinfo/testgroup')
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body.group.GroupName).toBe('testgroup');
	});

	it('should return 402 if a user is not a prticipant', async () => {
		GroupModel.findOne.mockResolvedValue({
			GroupName:'testgroup',
			Participants: ['Bob', 'John', 'William']
		});
		const token = CreateToken('Micheal');
		const res = await request(app)
			.get('/groupinfo/testgroup')
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(402);
		expect(res.body.message).toBe('You arent part of this group');
	});

	
})