require('dotenv').config();
const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const https = require('https');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const authRouter = require('./lib/auth.router');
const passportInit = require('./lib/passport.init');
const { PORT, CLIENT_ORIGIN } = require('./config');
const app = express();
let server;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

/**
    var HttpsProxyAgent = require('https-proxy-agent');
    if (process.env['https_proxy']) {
        options.agent = new HttpsProxyAgent(process.env['https_proxy']);
    }
    this._executeRequest(http_library, options, post_body, callback);
 */

// If we are in production we are already running in https
//if (process.env.NODE_ENV === 'production') {
server = http.createServer(app);
//}
// We are not in production so load up our certificates to be able to 
// run the server in https mode locally
// else {
//     const certOptions = {
//         key: fs.readFileSync(path.resolve('certs/server.key')),
//         cert: fs.readFileSync(path.resolve('certs/server.crt'))
//     }
//     server = https.createServer(certOptions, app)
// }

// Setup for passport and to accept JSON objects
app.use(express.json());
app.use(passport.initialize());
passportInit();

// Accept requests from our client
app.use(cors({
    origin: CLIENT_ORIGIN
}));

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Connecting sockets to the server and adding them to the request 
// so that we can access them later in the controller
const io = socketio(server);
app.set('io', io);

app.get('/wake-up', (req, res) => res.send('👍'));

app.use('/', authRouter);

server.listen(process.env.PORT || PORT, () => {
    console.log('listening...' + PORT)
});