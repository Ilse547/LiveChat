function ErrorHandler(err, req, res, next) {
	const status = err.status || 500;
	res.status(status).json({
		error: {
			code: err.code || 'Error',
			message: err.message || 'Something went wrong'
		}
	});
}

module.exports = { ErrorHandler}

