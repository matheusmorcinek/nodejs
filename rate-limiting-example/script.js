const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Apply rate limiter middleware
const limiter = rateLimit({
    windowMs: 10 * 1000, // 1 minute
    max: 3, // limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again in seconds.',
});

app.use(limiter);

// Your API endpoints
app.get('/api/v1/helloworld', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});