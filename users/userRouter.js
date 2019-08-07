const router = require('express').Router();

const userHubs = require('../users/userDb.js');
const postHubs = require('../posts/postDb.js');

router.post('/', validateUser, (req, res) => {
    userHubs.insert(req.user)
    .then(newUser => {
        res.status(201).json({ message: `${req.user.name} has successfully been added to the database`})
    })
    .catch(err => {
        res.status(500).json({ error: 'we messed up making your new guy (or gal)!' });
    })
});

//new posts for a user
router.post('/:id/posts', validateUserId, validatePost,  (req, res) => {
    console.log(req.post, req.user);

    req.post = {...req.post,
    user_id: req.user.id};

    postHubs.insert(req.post)
    .then(newPost => {
        if(newPost) {
            res.status(200).json({ message: 'Your post was added!' });
        } else {
            res.status(404).json({ error: 'somehow you made it this far without a post' });
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'there is something wrong here in making a new post' });
    })
});

router.get('/', (req, res) => {
    userHubs.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ error: 'there is something wrong here in the get all for users' });
    })
});

router.get('/:id', validateUserId, (req, res) => {
    userHubs.getById(req.user.id)
    .then(user => {
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({ userError: 'This user does not exist' });
        }
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userHubs.getById(req.user.id)
    .then(user => {
        if(user){
            userHubs.getUserPosts(user.id)
            .then(posts => {
                res.status(200).json(posts);
            })
        } else {
            res.status(404).json({ userError: 'This user does not exist' });
        }
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    userHubs.remove(req.user.id)
    .then(oldPost => {
        res.status(200).json(oldPost);
    })
    .catch(err => {
        res.status(500).json({ err: 'you messed up the delete' })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    userHubs.update(req.user.id, req.user)
    .then(newUser => {
        res.status(201).json({ message: `${req.user.name} has successfully been updated`})
    })
    .catch(err => {
        res.status(500).json({ error: 'we messed up updating your person...' });
    })
});

//custom middleware

function validateUserId(req, res, next) {
    if(req.params.id){
        req.user = { ...req.user,
                    id :req.params.id};
    } else{
        res.status(401).json({ error:'gimme dat id homie man'});
    }
    next();
};

function validateUser(req, res, next) {
    console.log(req.body, req.body.name)
    if(req.body && req.body.name) {
        req.user = {...req.user,
                    name: req.body.name};
    } else{
        res.status(401).json({ error:'gimme yo name'});
    }
    console.log('req.user', req.user);
    next();
};

function validatePost(req, res, next) {
    if(req.body && req.body.text) {
        req.post = req.body;
    } else{
        res.status(401).json({ error:'gimme what you wanna say'});
    }
    next();
};

module.exports = router;
