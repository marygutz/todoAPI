var Sequelize = require('sequelize')
var sequelize = new Sequelize(undefined, undefined, undefined, {
	// use sqlite db
  'dialect': 'sqlite',
	// where to store db
  'storage': __dirname + '/data/dev-todo-api.sqlite'
})

var db = {}

// .import lets you load in models from separate files
db.todo = sequelize.import(__dirname + '/models/todo.js')
// instance / attach sequelize onto object
db.sequelize = sequelize
// library
// db.Sequelize = Sequelize

module.exports = db
