const Task = require('../models/task');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const User = require('../models/user');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        const result = await task.save()
        console.log("result is : --> " + result);
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        
        /* 
            match: {
                completed: false/true
            }
        */

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //limits the data that will be fetched.
                skip: parseInt(req.query.skip),
                sort
                // sort: {
                //     //createdAt: -1, // 1 for ascending(newest record first) , -1 for descending (oldest record first),
                //     completed: 1 // 1 for completed = false values first , -1 for completed = true values first. 
                // }
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user.id});

        if (!task) return res.status(404).send();

        res.send(task);

    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid request' });
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        // const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);

    }
    catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (error) {
        res.status(500).send(error);
    }

})

module.exports = router;