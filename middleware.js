var cryptojs = require('crypto-js')
module.exports = function (db) {
  return {
  	// define pieces of middleware we want to use in app
	  // requireAuthentication - check for token, decrypt & get user id & type from token
	  requireAuthentication: function (req, res, next) {
	  	var token = req.get('Auth') || ''

	  	db.token.findOne({
	  		where: {
	  			tokenHash: cryptojs.MD5(token).toString()
	  		}
	  	}).then(function (tokenInstance) {
		    if (!tokenInstance) {
		      throw new Error()
		    }

		    req.token = tokenInstance
		    return db.user.findByToken(token)
	  	}).then(function (user) {
	  		req.user = user
	  		next()
	  	}).catch(function () {
		    res.status(401).send()
		  })
	  }
  }
}
