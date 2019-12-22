const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg = require("pg");
const passport = require("passport");

const config = require("../config/keys");
const validateRegisterInput = require("./register");
const validateLoginInput = require("./login");

const router = express.Router();
const pool = new pg.Pool(config);

router.post("/register", (req, reference) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) return reference.status(400).json(errors);

    let query = "select password from users where login = '" + req.body.email + "'";

    pool.connect((err, client) => {
        if (err) return reference.status(400).json({ result: 'ErrorConnectToDBForRegistration' });
        else {
            client.query(
                query, (err, res) => {
                    if (err) return reference.status(400).json({ result: 'ErrorExecuteDBQueryForRegistration' });
                    else {
                        if (res.rowCount != 0) return reference.status(400).json({ email: "EmailIsBusy" });
                        else {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(req.body.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    pool.connect((err, client) => {
                                        if (err) return reference.status(400).json({ result: 'ErrorConnectToAddNewUserInDB' });
                                        else {
                                            let insertQuery = "insert into users(nickname, login, password, acc_type, last_login) ";
                                            insertQuery += "values('" + req.body.nickname + "', '" + req.body.email + "', '" + hash + "', 0, NOW())"
                                            client.query(
                                                insertQuery, (err, res) => {
                                                    if (err) return reference.status(400).json({ result: 'ErrorExecuteDBQueryToAddNewUser' });
                                                    else {
                                                        console.log('new user ' + req.body.email + 'added');
                                                        return reference.json({
                                                            success: true
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    });
                                })
                            });
                        }
                    }
                });
        }
    });
});

router.post("/login", (req, reference) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) return reference.status(400).json(errors);

    const email = req.body.email;
    const password = req.body.password;
    const query = "select id, nickname, password, acc_type, language, times_mode from users where login = '" + email + "'";

    pool.connect((err, client) => {
        if (err) return reference.status(400).json({ result: 'ErrorConnectToDBForAuth' });
        else {
            client.query(
                query, (err, res) => {
                    if (err) return reference.status(400).json({ result: 'ErrorExecuteDBQueryForAuth' });
                    else {
                        if (res.rowCount === 0) return reference.status(404).json({ email: "UserNotExist" });
                        else {
                            bcrypt.compare(password, res.rows[0].password)
                                .then(isMatch => {
                                    if (isMatch) {
                                        const payload = {
                                            id: res.rows[0].id,
                                            nickname: res.rows[0].nickname,
                                            acc_type: res.rows[0].acc_type,
                                            language: res.rows[0].language,
                                            times_mode: res.rows[0].times_mode,
                                        };
                                        jwt.sign(
                                            payload,
                                            config.secretOrKey,
                                            {
                                                expiresIn: 120 // 1 year in seconds
                                                //expiresIn: 31556926 // 1 year in seconds
                                            },
                                            (err, token) => {
                                                //console.log(token);
                                                return reference.json({
                                                    success: true,
                                                    token: "Bearer " + token
                                                });
                                            }
                                        );
                                        pool.connect((err, client) => {
                                            if (!err)
                                                client.query(
                                                    "update users set last_login = NOW() where login = '" + email + "'"
                                                    , (err, res) => {
                                                        if (!err) {
                                                            console.log(Date.now() + ' Last login updated for user: ' + email);
                                                        }
                                                        else {
                                                            console.log('Err update last login for user: ' + email);
                                                            console.log(err);
                                                        }
                                                    }
                                                );
                                            else {
                                                console.log('Err connect to DB');
                                                console.log(err);
                                            }
                                        });
                                    }
                                    else return reference.status(400).json({ passwordincorrect: "IncorrectPassword" });
                                });
                        }
                    }
                }
            );
        }
    });
});

router.post("/updateuserdata", (req, reference) => {
    let query = "update users set language = " + req.body.language + " where id = " + req.body.id + " and nickname = '" + req.body.nickname + "'";
    pool.connect((err, client) => {
        if (err) return reference.status(400).json({ error: 'ErrorConnectToDBForUpdateUser' });
        else {
            client.query(query,
                (err, res) => {
                    if (err) return reference.status(400).json({ error: 'ErrorExecuteDBQueryForUpdateUser' });
                    else {
                        return reference.json({
                            success: true,
                        });
                    }
                });
        }
    });
});

module.exports = router;