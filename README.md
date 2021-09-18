# Mandh Authorization Library

Mandh Authorization Library is a Node.js library for manage authentication Mandh applications.

## Installation

Use [npm](https://www.npmjs.com/package/mandh-nodejs-authentication) package manager to install Mandh Authorization Library.

```bash
npm install mandh-nodejs-authentication
```

## Usage

```javascript
const express = require('express')
const MandhUserManagement = require('mandh-nodejs-authentication');
const app = express();
const bodyParser = require('body-parser')

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

MandhUserManagement.config.setConfig({
    connectionString: '',
});

MandhUserManagement.initialize.initializePassportForUser(app);

//Mandh user router.
// URL/{config.userRouterName}/login
// URL/{config.userRouterName}/register
// URL/{config.userRouterName}/logout
// URL/{config.userRouterName}/confirmation
// URL/{config.userRouterName}/changepassword
//If you change /user router name, you need to set that in config too.
app.use('/user', MandhUserManagement.routers.user.userRouter);

//Default service
app.get('/', (req, res) => {
    res.send('It is main page!')
})

//Authenticated service
app.get('/home', MandhUserManagement.handlers.isAuthenticated, (req, res) => {
    res.send('It is user home page')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
```

## Configurations
```javascript
const { setConfig }= require('mandh-nodejs-authentication').config;

setConfig({
    getUserByEmail: (email) => new Promise(res => res(userObject)),
    getUserById: (id) => new Promise(res => res(userObject)),
    getOrInsertUserByGoogleId: ({ googleId, accessToken, refreshToken, profile }) => new Promise(res => res(userObject)),
    getUserByGoogleId: (id) => new Promise(res => res(userObject)),
    getUserByUniqueField: (field, value) => new Promise(res => res(userObject)),
    createUser: (userObject) => new Promise(res => res(userObject)),,
    setUserConfirmed: (id) => new Promise(res => res({ nModified: 1 })),
    setUserPassword: (id, password) => new Promise(res => res({ nModified: 1 })),
    emailConfirm: true,
    emailConfiguration: {
        service: 'Yandex',
        user: 'user',
        password: 'password',
        emailName: 'emailName',
    },
    usernameField: enums.defaultUsernameField, //email
    passwordField: enums.defaultPasswordField, //password
    dbName: enums.defaultDbName, //MandhUser
    connectionString: '', //MongoDB connection string.
    host: 'http://www.example.com.tr', //Server host for redirections.
    userRouterName: 'user', //user router name can be modified.
    googleRouterName: 'google',
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
    googleScopes: ['https://www.googleapis.com/auth/plus.login']
});


```

## TODO
* Google authentication is not tested.
* Register with email confirmation is not tested.
* Facebook, Twitter and Instagram login will be integrated.

## License
[MIT](https://choosealicense.com/licenses/mit/)