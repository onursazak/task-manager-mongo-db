//CURD create, read , update , delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'

// const id = new ObjectID()
// const time = id.getTimestamp();
// console.log(id);
// console.log(time);

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({ name: 'Jen'}, (error, user) => {
    //     if(error) {
    //         return console.log('Unable to fetch');
    //     }
    //     console.log(user);
    // })

    // it returns only first occurence.
    // db.collection('users').findOne({ _id: new ObjectID("5f529ae5d96f04125849719b")}, (error, user) => {
    //     if(error) {
    //         return console.log('Unable to fetch');
    //     }
    //     console.log(user);
    // })

    // find returns 'cursor' not a data itself.
    // it returns all occurences contains Jen.
    db.collection('users').find({name: 'Jen'}).toArray((error, users) => {
        console.log(users);
    });

})
