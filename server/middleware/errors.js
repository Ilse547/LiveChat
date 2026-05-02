function ErrorHandler(err, req, res, next) {
	const status = err.status;
	res.status(status).json({
		error: {
			code: err.code || 'Error',
			message: err.message || 'Something went wrong'
		}
	});
}

module.exports = { ErrorHandler}

