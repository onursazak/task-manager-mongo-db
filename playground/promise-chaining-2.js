require('../src/db/mongoose');

const Task = require('../src/models/task');

// Task.findByIdAndDelete('5f5e6fa1e3a5e43c84fc704b').then((result) => {
//     console.log(result);
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result);
// })


const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count;
}

deleteTaskAndCount("5f6121306ca0a5e9b1115e8e").then((result) => {
    console.log(result);
}).catch(e => console.log(e));