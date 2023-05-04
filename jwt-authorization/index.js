const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

// set up bodyParser middleware to parse request body
app.use(bodyParser.json());

// set up a secret key for signing JWTs
const secretKey = 'mysecretkey-matheusmorcinek';

// define a sample user object with a username and password
const user = {
  username: 'Matheus',
  password: '123456'
};

// define a function to authenticate a user
function authenticateUser(username, password) {
  // check if the username and password match the sample user object
  if (username === user.username && password === user.password) {
    // if the user is authenticated, return the user object without the password
    return {
      username: user.username
    };
  } else {
    // if the user is not authenticated, return null
    return null;
  }
}

// define a route to handle user login
app.post('/api/v1/login', (req, res) => {
  // get the username and password from the request body
  const { username, password } = req.body;

  // authenticate the user
  const authenticatedUser = authenticateUser(username, password);

  if (authenticatedUser !== null) {
    // if the user is authenticated, generate a JWT with the user object as the payload
    const token = jwt.sign(authenticatedUser, secretKey, { expiresIn: '5m' });

    // return the JWT to the client
    res.json({ token });
  } else {
    // if the user is not authenticated, return an error message
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// define a route that requires authentication
app.get('/api/v1/helloworld', (req, res) => {
  // get the JWT from the authorization header
  const authHeader = req.headers.authorization;

  if (authHeader !== undefined) {
    const [type, token] = authHeader.split(' ');

    if (type === 'Bearer' && token !== undefined) {
      // if the JWT is valid, decode the payload and return it to the client
      try {
        const payload = jwt.verify(token, secretKey);
        res.json({ message: `Hello, ${payload.username}!` });
      } catch (err) {
        // if the JWT is invalid, return an error message
        res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      // if the authorization header is not valid, return an error message
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    // if the authorization header is missing, return an error message
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});