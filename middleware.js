module.exports = function (db) {
  return {
  	// define pieces of middleware we want to use in app
	  // requireAuthentication - check for token, decrypt & get user id & type from token
	  requireAuthentication: function (req, res, next) {
	  	var token = req.get('Auth')
	  	db.user.findByToken(token).then(function (user) {
	  		// add user onto req obj
	  		req.user = user
	  		next()
	  	}, function () {
	  		res.status(401).send() // not calling next so process stops
	  	})
	  }
  }
}
