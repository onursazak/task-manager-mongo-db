const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.includes('password')) {
                throw new Error('password can not be \'password\'')
            }
        }
    }
})

// const me = new User({
//     name: '   Onur      ',
//     email: 'OnrRRr@mail.com',
//     password: '1234566'
// })

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log("Error! ", error);
// })

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const task1 = new Task({
    description: '    Clean the dishes         ',
    completed: false
})

task1.save().then(() => {
    console.log(task1);
}).catch((error) => {
    console.log(error)
})