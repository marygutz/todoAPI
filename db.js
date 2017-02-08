var Sequelize = require('sequelize')
var env = process.env.NODE_ENV || 'development'
var sequelize

if (env === 'production') { // heroku
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
  })
} else { // local
  sequelize = new Sequelize(undefined, undefined, undefined, {
	// use sqlite db
    'dialect': 'sqlite',
	// where to store db
    'storage': __dirname + '/data/dev-todo-api.sqlite'
  })
}

var db = {}

// .import lets you load in models from separate files
db.todo = sequelize.import(__dirname + '/models/todo.js')
// instance / attach sequelize onto object
db.sequelize = sequelize
// library
// db.Sequelize = Sequelize
db.user = sequelize.import(__dirname + '/models/user.js')
db.token = sequelize.import(__dirname + '/models/token.js')
// call sequelize belongsTo and hasMany methods
// belongsTo(takes model todo belongs to)
db.todo.belongsTo(db.user)
db.user.hasMany(db.todo)

module.exports = db
