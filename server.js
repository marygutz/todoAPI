var express = require('express')
var bodyParser = require('body-parser')
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
  res.json(todos)
})

// GET list of todos
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var matched

  todos.forEach(function (todo) {
  	if (todoId === todo.id) {
  		matched = todo
  		}
  })
  	if (matched) {
    	res.json(matched)
  	} else {
  		res.status(404).send()
  	}
})

app.post('/todos', function (req, res) {
  var body = req.body

  // add id field
  body.id = todoNextId
  todoNextId++

  // push body into array
  todos.push(body)

  req.body
  //
  res.json(body)
})

app.listen(PORT, function () {
  console.log('express listening on port ' + PORT + '!')
})
