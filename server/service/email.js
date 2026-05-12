//nodemailer
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
	await transporter.sendMail({
		from: `"LiveChat" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html
	});
};


const sendConfirmationEmail = async (ToEmail, username, Code) => {
	await sendEmail(
		ToEmail,
		'Livechat Confirmation Email',
		`
			<h1>Hello, ${username} </h1>
			<p>Your Account was created :)</p>
			<h2 style="letter-spacing: 4px;">${Code}</h2>
			<p>This is a confirmation code</p>
		`
	);
};

const sendLoginEmail = async (ToEmail, username, Code) => {
	await sendEmail(
		ToEmail,
		'Livechat Login Code',
		`
			<h1>Hello, ${username} </h1>
			<p>This is the Login Code</p>
			<h2 style="letter-spacing: 4px; color:red;">${Code}</h2>
			<p> This code is valid for <strong>10 minutes</strong></p>
			<p>Have fun :)</p>
		`
	);
};


const SendPasswordResetEmail = async (ToEmail, username, Code) => {
	await SendEmail(
		ToEmail,
		'Livechat Resetting Credentials',
		`
			<h1>Hello, ${username} </h1>
			<p>This is the verification code</p>
			<h2 style="letter-spacing: 4px; color:red;">${Code}</h2>
			<p> This code is valid for <strong>10 minutes</strong></p>
			<p>Have fun :)</p>
		`
	);
};
module.exports = { sendConfirmationEmail, sendLoginEmail, SendPasswordResetEmail };