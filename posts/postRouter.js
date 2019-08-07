const router = require('express').Router();

const postHubs = require('../posts/postDb.js');

router.get('/', (req, res) => {
    postHubs.get()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: 'there is something wrong here in the get all for posts' });
    })
});

router.get('/:id', validatePostId, (req, res) => {
    postHubs.getById(id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({ postError: 'This post does not exist' });
        }
    })
});

router.delete('/:id', validatePostId, (req, res) => {
    postHubs.getById(id)
    .then(post => {
        if(post) {
            postHubs.remove(id)
            .then(oldPost => {
                res.status(200).json({ post: `\n${oldPost}\n has been deleted` })
            })
        } else{
            res.status(404).json({ postError: 'This post does not exist to delete.' });
        }
    })
    .catch( err => {
        res.status(500).json({ error: 'there is something wrong here in the delete post' });
    })
});

router.put('/:id', validatePostId, (req, res) => {
    let changes = req.body;
    postHubs.getById(id)
    .then(post => {
       
        if(post) {
            changes = {...changes,
            user_id: post.user_id};

            postHubs.update(id, changes)
            .then(updated => {
                if(changes.text && changes.user_id) {
                    res.status(200).json({ post: `\n${updated}\n has been updated!` })
                }else{
                    res.status(401).json({ error: 'you need text and a user id to submit the update' });
                }
                
            })
        } else{
            res.status(404).json({ postError: 'This post does not exist to delete.' });
        }
    })
    .catch( err => {
        res.status(500).json({ error: 'there is something wrong here in the update post' });
    })
});

// custom middleware

function validatePostId(req, res, next) {
    if(req.params.id){
        id = req.params.id;
    } else{
        res.status(401).json({ error:'gimme dat id homie man'});
    }
    next();
};

module.exports = router;