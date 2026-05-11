function sanitize(req, res, next) {
	if (req.body) {
		req.body = sanitizeObject(req.body);
	}
	next();
}

function sanitizeObject(obj) {
	if (typeof obj !== 'object'|| obj === null ) return obj;
	const clean ={};
	for (const key of Object.keys(obj)) {
		const cleanKey = key.replace(/^\$/, '_');
		clean[cleanKey] = sanitizeObject(obj[key]);
	}
	return clean;
}

module.exports = { sanitize };
