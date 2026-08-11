 function requireSession(req, res, next) { if (!req.session || !req.session.adminId) { return res.redirect('/login'); } next(); } module.exports = requireSession;
