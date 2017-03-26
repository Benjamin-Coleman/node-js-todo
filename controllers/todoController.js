var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://test:test@ds141950.mlab.com:41950/todo');

//create schema
var todoSchema = new mongoose.Schema({
	item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

	app.get('/todo', function(req, res){
		//get data from mongodb and pass it to the view
		Todo.find({}, function(err, data){
			if (err) throw err;
			res.render('todos', {todos: data});
		});
		

	});

	app.post('/todo', urlencodedParser, function(req, res){
		//get data from view and add it to mongodb
		var newTodo = Todo(req.body, todoSchema).save(function(err, data){
			if (err) throw err;
			res.json(data);
		})
	});

	app.delete('/todo/:item', function(req, res){
		//delete the request item from mongodb
		Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
			if (err) throw err;
			res.json(data);
		})

	});

};