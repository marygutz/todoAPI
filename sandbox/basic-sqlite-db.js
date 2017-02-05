var Sequelize = require('sequelize')
var sequelize = new Sequelize(undefined, undefined, undefined, {
	// use sqlite db
  'dialect': 'sqlite',
	// where to store db
  'storage': __dirname + '/basic-sqlite-db.sqlite'
})

// sets up the model
var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
    	len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

// syncs w db
sequelize.sync({
  // force: true
}).then(function () {
  console.log('everything is synced')

  // fetch todo by id
  // print toscreen using tojson
  // else not found
  Todo.findById(3).then(function (todo) {
  	if (todo) {
  		console.log(todo.toJSON())
  	} else {
  		console.log('not found')
  	}
  })

  // Todo.create({
  // 		description: 'take out trash'
  // })
  // .then(function (todo) {
  // 	return Todo.create({
  // 		description: 'Clean office'
  // 	})
  // })
  // .then(function () {
  // 	return Todo.findAll({
  // 		where: {
  // 			description: {
  //   			$like: '%trash%'
  // 			}
  // 		}
  // 	})
  // })
  // // .then(function () {
  // // 	return Todo.findById(1)
  // // })
  // .then(function (todos) {
  // 	if (todos) {
  // 		todos.forEach(function (todo) {
  // 			console.log(todo.toJSON())
  // 		})
  // 	} else {
  // 		console.log('no todos found')
  // 	}
  // }).catch(function (e) {
  // 	console.log(e)
  // })
})
