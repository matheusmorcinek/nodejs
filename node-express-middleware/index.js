const express = require('express');

const app = express();

const middleware = (req, res, next) => {
    console.log('Middleware');
    console.log('req', req);
    console.log('res', res);
    next();
};

app.use(middleware);

// Your API endpoints
app.get('/api/v1/helloworld', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});