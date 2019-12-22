require("dotenv").config();
const express = require("express");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require('cors')
const socketio = require("socket.io");
const authRouter = require("./lib/auth.router");
//const passportInit = require("./lib/passport.init");
const { PORT, CLIENT_ORIGIN } = require("./config");
const config = require("./config/keys");
const users = require("./actions/users");
const pg = require("pg");
const app = express();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

let server = http.createServer(app);
const io = socketio(server);
const pool = new pg.Pool(config);
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use(passport.initialize());
//passportInit();
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}));
app.set("io", io);
app.get("/wake-up", (req, res) => res.send("👍"));
app.use("/", authRouter);
// Routes 
require("./config/passport")(passport);
app.use("/actions/users", cors(corsOptions), users);
server.listen(process.env.PORT || PORT, () => {
    console.log("listening..." + PORT)
});

app.get("/db", (request, response) => {
    pool.connect(function (err, client) {
        if (!err)
            client.query(
                "select p.id as post_id, " +
                "p.title as post_title, " +
                "p.content as post_content, " +
                "p.create_date, " +
                "array[ u.id::varchar(255), u.nickname ] as create_user, " +
                "array_agg( array[ t.id::varchar(255), t.name_rus, t.name_eng, t.img_url ] ) as tags, " +
                "array[ s.name_rus, s.name_eng ] as status " +
                "from posts p " +
                "inner join users u on u.id = p.create_user " +
                "inner join status s on s.id = p.status_id " +
                "left join (select post_id, t.id, name_rus, name_eng, img_url " +
                "from posts_tags pt " +
                "inner join tags t on t.id = pt.tag_id " +
                "order by t.id asc) t on t.post_id = p.id " +
                "group by p.id, p.title, p.content, p.create_date, u.id, u.nickname, s.name_rus, s.name_eng " +
                "order by p.create_date desc"
                , (err, res) => {
                    if (!err)
                        response.send(res.rows);
                    else
                        response.send("failed load posts from DB");
                }
            );
        else
            response.send("Error connect to DB");
    })
});