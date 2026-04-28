//nodemailer
const nodemailer = require('nodemailer');



const SendConfirmationEmail = async (ToEmail, username) => {
	const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
		}
	});

	await transporter.sendMail({
		from: `"LiveChat" <${process.env.EMAIL_USER}>`,
		to: ToEmail,
		subject: 'Livechat confirmation email',
		html: `
			<h1>This si a confirmation email to ${username} </h1>
			<p>Account created :)</p>
			`
	});
};

module.exports = { SendConfirmationEmail };