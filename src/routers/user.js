const User = require('../models/user');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');


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
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please provide a jpg, jpeg or png file.'));
        }

        callback(undefined, true);
    }
        
})

router.post('/users/me/avatar', auth, upload.single('avatar') , async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined;
    await req.user.save();
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

router.get('/users/:id/avatar', async (req,res) => {
   try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }

        //setting response header
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
   } catch(e) {
       res.status(404).send();
   }
})

module.exports = router;