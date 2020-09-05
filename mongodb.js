//CURD create, read , update , delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName);

    //check the docs for update operators ($set, $inc ...)

    // db.collection('users').updateOne({
    //     _id: new ObjectID('5f4d5b0c1d14a12448282c35')
    // }, {
    //     // to incremenet age field by 2.
    //     $inc: {
    //         age: 2
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('newTask').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => console.log(error));
})
