const express = require('express');
const mongoose = require('mongoose');
require('./db/mongoose')
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

// it automatically parses incoming JSON to an object.
app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send();
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);

    }).catch((e) => {
        // if length of id is less than 12 , mongoose throw an cast error.Thus, it it will return 500 status code instead of 404.
        // to prevent this we can use isValid check.
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: 'Invalid ID!' })
        }
        res.status(500).send();
    })

})


app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        console.log("task is : ");
        console.log(task);
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send();
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    
    Task.findById(_id).then((task) => {

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    }).catch((error) => {
        res.status(500).send();
    })
})

app.listen(port, () => {
    console.log("server is up on port : " + port);
})

