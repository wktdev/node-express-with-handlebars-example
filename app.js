//_______________________________________________________BEGIN setup

var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var expressHbs = require('express-handlebars');

app.engine('hbs', expressHbs({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')))


mongoose.connect('mongodb://localhost/app');

var Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true
    }
})

//_______________________________________________________END setup



//_______________________________________________________BEGIN Read ( render ) todos to home page 
app.get('/', function(req, res) {

    Todo.find(function(err, toHBS) {
        res.render('index', {
            todos: toHBS
        });
    });
});

//_______________________________________________________END Read ( render ) todos to home page


//_______________________________________________________BEGIN Create todo and update page
app.post('/', function(req, res) {

    var todo = new Todo({
        task: req.body.task
    }).save(function(err) {
        //______________________________|BEGIN
        Todo.find(function(err, toHBS) {
            res.render('index', {
                todos: toHBS
            });
        });
        //______________________________|END

    });

});

//_______________________________________________________END Create todo and update page




//_______________________________________________________BEGIN Update todo




app.get('/edit/:id/', function(req, res) {

    var id = req.params.id;

    Todo.findOne({
        _id: id
    }, function(err, doc) {

        res.render('edit', {
            todos: doc
        });

    });


})



app.post('/update/:id', function(req, res) {

    var id = req.params.id;

    Todo.findById(id, function(err, todo) {


        todo.task = req.body.task
        todo.save();

        return res.redirect('/');

    });


})



//_______________________________________________________END Update todo









//_______________________________________________________BEGIN Delete todo and update the page


app.get('/delete/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!err) {

            todo.remove();
        } else {
            return err
        }
    });
    return res.redirect('/');
})


//_______________________________________________________END Delete todo and update the page









//_______________________________________________________BEGIN start server

app.listen(8080, function(err) {
    if (err) {
        console.log('server is fucked ');
    } else {
        console.log('server works...I hope ')
    }
})
//_______________________________________________________END start server