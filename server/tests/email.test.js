const { sendConfirmationEmail, sendLoginEmail } = require('../service/email');

jest.mock('nodemailer', () => ({
	createTransport: jest.fn().mockReturnValue({
		sendMail: jest.fn().mockResolvedValue(true)
	})
}));

describe('Email Service', () => {
	it('Should do sendMail when SendLoginEmail', async ()=> {
		await expect(
			sendLoginEmail('www@iamcool.com', 'CoolUser', '123456')
		).resolves.not.toThrow();
	});
	it('Should do swndMail when SendConfirmationEmail', async () =>{
		await expect(
			sendConfirmationEmail('www@iamcool.com', 'CoolUser', '123456')
		).resolves.not.toThrow();
	});
});
