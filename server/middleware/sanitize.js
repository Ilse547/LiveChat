function sanitize(req, res, next) {
	if (req.body) {
		req.body = JSON.parse(
			JSON.stringify(req.body)
			.replace(/\$|\./g, '_')
		);
	}
	next();
}
module.exports = { sanitize };
