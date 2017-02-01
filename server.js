var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')

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
app.get('/todos', function (req, res) {
  // access queryParams
  var queryParams = req.query
  var filteredTodos = todos

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
  	filteredTodos = _.where(filteredTodos, {completed: true})
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
  	filteredTodos = _.where(filteredTodos, {completed: false})
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

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  	return res.status(400).send()
  }

  // set body.description to be trimmed value
  body.description = body.description.trim()

  // add id field
  body.id = todoNextId
  todoNextId++

  // push body into array
  todos.push(body)

  res.json(body)
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

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
  	validAttributes.completed = body.completed
  } else if (body.hasOwnProperty('completed')) {
  	return res.status(400).send()
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
  	validAttributes.description = body.description
  } else if (body.hasOwnProperty('description')) {
  	return res.status(400).send()
  }

  _.extend(matched, validAttributes)
  res.json(matched)
})

app.listen(PORT, function () {
  console.log('express listening on port ' + PORT + '!')
})
