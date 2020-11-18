const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

//Express middleware.
// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled');
//     } else {
//         next();
//     }
// });

// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Check back soon");
// });

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // !file.originalname.endsWith('.pdf')
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return callback(new Error('Please upload a word document'));
        }
        callback(undefined, true);

        //     callback(new Error('File must be a PDF')); //something went wrong
        //     callback(undefined, true); // nothing went wrong
        //     callback(undefined, false); //silently reject
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})

// it automatically parses incoming JSON to an object.
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("server is up on port : " + port);
});

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async() => {
// //     const task = await Task.findById('5f8c36d13467931df8588e0c');
// //     await task.populate('owner').execPopulate();
// //     console.log(task.owner);
//     const user = await User.findById('5f8c36ad3467931df8588e0a');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// };

// main();
