const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

// const me = new User({
//     name: 'Onur',
//     age: 26
// })

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log("Error! ", error.message);
// })

const Task = mongoose.model('Task', {
    name: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const task1 = new Task({
    name: 'Clean the dishes',
    completed: false
})

task1.save().then(() => {
    console.log(task1);
}).catch((error) => {
    console.log(error)
})