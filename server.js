var express = require('express')
var app = express()
var PORT = process.env.PORT || 3000

// model in collection
var todos = [{
  id: 1,
  description: 'meet mom for lunch',
  completed: false
},
  {
    id: 2,
    description: 'go to market',
    completed: false
  },
  {
    id: 3,
    description: 'do laundry',
    completed: true
  }
]

app.get('/', function (req, res) {
  res.send('todo API root')
})

// get list of todos
app.get('/todos', function (req, res) {
  res.json(todos)
})

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

app.listen(PORT, function () {
  console.log('express listening on port ' + PORT + '!')
})
