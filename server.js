var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var db = require('./db.js')

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
app.get('/todos', function (req, res) {
  // access queryParams
  var queryParams = req.query
  var filteredTodos = todos

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  	filteredTodos = _.where(filteredTodos, {completed: true})
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  	filteredTodos = _.where(filteredTodos, {completed: false})
  }

  // q > 0
  // use indexOf to search for string of queryParam
  // "bla bla bla".indexOf('work')
  // returns -1 if not exist, or pos in str. if > -1, add to filtered todos
  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  	filteredTodos = _.filter(filteredTodos, function (todo) {
  		// console.log(queryParams.q.toLowerCase())
  		var query = queryParams.q.toLowerCase()
  		console.log(query)
  		return todo.description.toLowerCase().indexOf(query) > -1
  		// wtf is all this?
  		// todo - the foreach each
  		// description - ?
  		// tolowercase - strtolower
  		//
  		// indexOf - Returns the index at which value can be found in the array,
  		// or -1 if value is not present in the array. If you're working with a large array,
  		// and you know that the array is already sorted,
  		// pass true for isSorted to use a faster binary search ...
  		// or, pass a number as the third argument in order to look for
  		// the first matching value in the array
  		// after the given index.
  		//
  		// .filter Looks through each value in the list,
  		// returning an array of all the values that pass a truth test (predicate).
  		//
  		// (queryParams.q.tolowercase)
  		// queryParmas var req.query
  		// q - the query param
  		// tolowercase - strtolower
  		// > -1 if indexOf is > -1
  		// then return this.
  		//
  	})
  }

  res.json(filteredTodos)
})

// GET list of todos
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  // var matched

  // todos.forEach(function (todo) {
  // 	if (todoId === todo.id) {
  // 		matched = todo
  // 		}
  // })
  // instead, use underscore:
  var matched = _.findWhere(todos, {id: todoId})

  	if (matched) {
    	res.json(matched)
  	} else {
  		res.status(404).send()
  	}
})

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed')

  db.todo.create(body).then(function (todo) {
  	res.json(todo)
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
app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var matched = _.findWhere(todos, {id: todoId})

  	if (matched) {
    	todos = _.without(todos, matched)
    	res.json(matched)
  	} else {
  		res.status(404).send()
  	}
})

// PUT
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var matched = _.findWhere(todos, {id: todoId})
  var body = _.pick(req.body, 'description', 'completed')
  var validAttributes = {}

  if (!matched) {
  	return status(404).send()
  }

  if (body.hasOwnProperty('completed')
  	&& _.isBoolean(body.completed)) {
  	validAttributes.completed = body.completed
  } else if (body.hasOwnProperty('completed')) {
  	return res.status(400).send()
  }

  if (body.hasOwnProperty('description')
  	&& _.isString(body.description)
  	&& body.description.trim().length > 0) {
  	validAttributes.description = body.description
  } else if (body.hasOwnProperty('description')) {
  	return res.status(400).send()
  }

  _.extend(matched, validAttributes)
  res.json(matched)
})

db.sequelize.sync().then(function () {
	// start server
  app.listen(PORT, function () {
    console.log('express listening on port ' + PORT + '!')
  })
})

