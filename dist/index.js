"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const cors_1 = __importDefault(require("cors"));
const session = require("express-session");
require('dotenv').config();
const passport_github_1 = require("passport-github");
const app = (0, express_1.default)();
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
app.use(express_1.default.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
app.use((0, cors_1.default)({ origin: "*" }));
const db = new sqlite3_1.default.Database("data/db.sqlite3", (err) => { if (err)
    console.log(err); });
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, githubId TEXT)", (err) => { if (err)
    console.log(err); });
app.use(passport_1.default.initialize());
passport_1.default.use(new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    const user = { name: profile.username, githubId: profile.id };
    db.run("INSERT INTO users (name, githubId) VALUES (?, ?)", [profile.username, profile.id], (err) => { return cb(err, user); });
}));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/auth/github", passport_1.default.authenticate("github"));
app.get("/auth/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
app.get("/query", (req, res) => {
    if (!passport_1.default.session())
        return res.status(401).send("Unauthorized");
    return res.send("Authorized");
});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
//# sourceMappingURL=index.js.map