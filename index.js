// code away!

const express = require('express');

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

const server = express();
function logger(req, res, next) {
    const method = req.method;
    const url = req.url;
    console.log(`at ${Date.now()} you requested ${method} at the ${url} location`);
    next();
}

server.use(express.json());
server.use(logger);
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
  });

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`\n All Clear for Take Off at ${port}, Star Fox \n`));