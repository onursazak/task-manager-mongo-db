const User = require('../models/user');
const express = require('express');
const router = new express.Router();


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }

});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    const user = await User.findById(_id);
    try {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // new option to return the new user
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async(req, res) => {
    

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);

    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;