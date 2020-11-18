const User = require('../models/user');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }

});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        //when we pass object into res.send, it implicitly call JSON.stringify.
        //JSON.stringify calls toJSON function of the object.
        //toJSON method gets called. (in /models/user.js)
        res.send({ user: user, token });
    } catch (e) {
        res.status(400).send();
    }
});

// when someone makes a get request to /users , it first run middleware (auth) then runs the route handler.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ status: true });
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }
    catch (error) {
        console.log("error --> ", error);
        res.status(400).send(error);
    }
});

const upload = multer({
    //destination to save the file.
    dest: 'avatars' 
})

router.post('/users/me/avatar', upload.single('avatar') , (req,res) => {
    res.send();
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;