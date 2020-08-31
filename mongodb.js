
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name: 'Onur',
    //     age: 26
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }

    //     console.log(result.ops);
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28        
    //     },
    //     {
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log(error)
    //     }

    //     console.log(result.ops);
    // })

    db.collection('newTask').insertMany([
        {
            description: 'Homework',
            completed: false
        },
        {
            description: 'kitchen cleaning',
            completed: false
        },
        {
            description: 'shopping',
            completed: true
        }
    ],(error, result) => {
        if(error) {
            return console.log(error)
        }

        console.log(result.ops);
    })
})
