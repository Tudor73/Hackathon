import "reflect-metadata";
import express  from "express";
import passport from "passport";
import sqlite3  from "sqlite3";
import cors from "cors";
const session = require("express-session")
require('dotenv').config()
import {Strategy as GitHubStrategy} from "passport-github";


const app = express();
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user:any, done) {
    done(null, user);
  });


app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }));
app.use(cors({ origin: "*" }));
const db = new sqlite3.Database("data/db.sqlite3", (err) => {if (err) console.log(err) });
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, githubId TEXT)", (err) => { if (err) console.log(err) });
app.use(passport.initialize())



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(profile)
    const user = {name: profile.username, githubId: profile.id}
    db.run("INSERT INTO users (name, githubId) VALUES (?, ?)", [profile.username, profile.id], (err) => { return cb(err, user) });
  }
));



app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {

    res.redirect("/");
});


app.get("/query", (req, res) => {
    if (!passport.session())
        return res.status(401).send("Unauthorized");
    return res.send("Authorized")
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
    // console.log(__dirname)
});



