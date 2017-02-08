var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var db = require('./db.js')
var bcrypt = require('bcryptjs')
var middleware = require('./middleware.js')(db)

var app = express()
var PORT = process.env.PORT || 3000

// model in collection
var todos = []
var todoNextId = 1

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('todo API root')
})

// GET list of todos
// /todos?completed=true&q=house
app.get('/todos', middleware.requireAuthentication, function (req, res) {
  // access queryParams
  var queryParams = req.query
  // var filteredTodos = todos
  var where = {userId: req.user.get('id')}

  // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  // 	filteredTodos = _.where(filteredTodos, {completed: true})
  // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  // 	filteredTodos = _.where(filteredTodos, {completed: false})
  // }

  // q > 0
  // use indexOf to search for string of queryParam
  // "bla bla bla".indexOf('work')
  // returns -1 if not exist, or pos in str. if > -1, add to filtered todos
  // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  // 	filteredTodos = _.filter(filteredTodos, function (todo) {
  // 		// console.log(queryParams.q.toLowerCase())
  // 		var query = queryParams.q.toLowerCase()
  // 		console.log(query)
  // 		return todo.description.toLowerCase().indexOf(query) > -1
  // 		// wtf is all this?
  // 		// todo - the foreach each
  // 		// description - ?
  // 		// tolowercase - strtolower
  // 		//
  // 		// indexOf - Returns the index at which value can be found in the array,
  // 		// or -1 if value is not present in the array. If you're working with a large array,
  // 		// and you know that the array is already sorted,
  // 		// pass true for isSorted to use a faster binary search ...
  // 		// or, pass a number as the third argument in order to look for
  // 		// the first matching value in the array
  // 		// after the given index.
  // 		//
  // 		// .filter Looks through each value in the list,
  // 		// returning an array of all the values that pass a truth test (predicate).
  // 		//
  // 		// (queryParams.q.tolowercase)
  // 		// queryParmas var req.query
  // 		// q - the query param
  // 		// tolowercase - strtolower
  // 		// > -1 if indexOf is > -1
  // 		// then return this.
  // 		//
  // 	})
  // }

  // sequelize:
  // use findall and pass a where clause

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  	where.completed = true
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  	where.completed = false
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  	where.description = {
  		$like: '%' + queryParams.q + '%'
  	}
  }
  db.todo.findAll({where: where}).then(function (todos) {
  	res.json(todos)
  }, function (e) {
  	res.status(500).send()
  })

  // res.json(filteredTodos)
})

// GET list of todos
app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var where = {id: todoId, userId: req.user.get('id')}
  // var matched

  // todos.forEach(function (todo) {
  // 	if (todoId === todo.id) {
  // 		matched = todo
  // 		}
  // })
  // instead, use underscore:
  // var matched = _.findWhere(todos, {id: todoId})
// if (matched) {
//  	res.json(matched)
// } else {
// 	res.status(404).send()
// }
//
// instead, use sql obj
//
// use findOne using where obj
// then findById
//
  db.todo.findOne({where: where})
  .then(function (todo) {
  	if (todo) {
  		res.json(todo)
  	} else {
  		res.status(404).send()
  	}
  }, function (e) {
  	res.status(500).send()
  })
})

app.post('/todos', middleware.requireAuthentication, function (req, res) {
  var body = _.pick(req.body, 'description', 'completed')

  db.todo.create(body).then(function (todo) {
  	// res.json(todo)
  	//
  	// create assoc, update item, return item
  	req.user.addTodo(todo).then(function () {
  		return todo.reload()
  	}).then(function (todo) {
  		res.json(todo)
  	})
  }, function (e) {
  	res.status(400).json(e)
  })
  // if (body.description) {
  // // sequelize.define('todo', {...
  //   db.todo.create({
  // 		description: body.description
  //   })
  //   todos.push(body)
  //   res.json(body)
  // } else {
  //   res.status(400).json(e).send
  // }

// res with 200 and value .toJSON
// else pass e and pass to res.toJSON(e)
//
  // if (!_.isBoolean(body.completed)
  // || !_.isString(body.description)
  // || body.description.trim().length === 0) {
  // 	return res.status(400).send()
  // }

  // // set body.description to be trimmed value
  // body.description = body.description.trim()

  // // add id field
  // body.id = todoNextId
  // todoNextId++

  // // push body into array
  // todos.push(body)

  // res.json(body)
})

// DELETE
app.delete('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  // var matched = _.findWhere(todos, {id: todoId})
  db.todo.destroy({
    where: {
      id: todoId,
      userId: req.user.get('id')
    }
  }).then(function (rowsDeleted) {
  	if (rowsDeleted === 0) {
  		res.status(404).json({
  			error: 'todo not found by that id'
  		})
  	} else {
  		res.status(204).send()
  	}
  }, function () {
  	res.status(500).send()
  })
})

// PUT
app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var body = _.pick(req.body, 'description', 'completed')
  var attributes = {}

  if (body.hasOwnProperty('completed')) {
  	attributes.completed = body.completed
  }

  if (body.hasOwnProperty('description')) {
  	attributes.description = body.description
  }
  db.todo.findOne({
    where: {
      id: todoId,
      userId: req.user.get('id')
    }
  }).then(function (todo) {
  	if (todo) {
  		return todo.update(attributes).then(function (todo) {
		    res.json(todo)
		  }, function (e) {
		  	res.status(400).json(e)
		  })
  	} else {
  		res.status(404).send()
  	}
  }, function () {
  	res.status(500).send()
  })

//
})

app.post('/users', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')

  db.user.create(body).then(function (user) {
  	res.json(user.toPublicJSON())
  }, function (e) {
  	res.status(400).json(e)
  })
})

app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')

  db.user.authenticate(body).then(function (user) {
  	var token = user.generateToken('authentication')
  	if (token) {
    	res.header('Auth', user.generateToken('authentication')).json(user.toPublicJSON())
  } else {
    res.status(401).send()
  }
  }, function () {
    res.status(401).send()
  })
})

db.sequelize.sync(
	{force: true}
	).then(function () {
	// start server
  app.listen(PORT, function () {
    console.log('express listening on port ' + PORT + '!')
  })
})

