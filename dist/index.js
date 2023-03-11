"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const openai_1 = require("openai");
const cors_1 = __importDefault(require("cors"));
const session = require("express-session");
require('dotenv').config();
const passport_github_1 = require("passport-github");
const port = process.env.PORT || 3000;
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
    callbackURL: "https://hackathon-production-6f8c.up.railway.app/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    const user = { name: profile.username, githubId: profile.id };
    db.run("INSERT INTO users (name, githubId) VALUES (?, ?)", [profile.username, profile.id], (err) => { return cb(err, user); });
}));
function aiReq(questionForGPT) {
    return __awaiter(this, void 0, void 0, function* () {
        let configuration = new openai_1.Configuration({
            apiKey: "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"
        });
        let openai = new openai_1.OpenAIApi(configuration);
        return openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": questionForGPT }],
            temperature: 0.1
        });
    });
}
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/auth/github", passport_1.default.authenticate("github"));
app.get("/auth/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
app.post("/query", (req, res) => {
    const language = req.body.language;
    const code = req.body.code;
    const prompt = `Respond using markdown and write only code. Better ways to write this in ${language}: ${code}`;
    aiReq(prompt).then((data) => {
        var _a;
        res.send((_a = data.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
    });
});
app.listen(port, () => {
    console.log("Server started on port 3000");
});
//# sourceMappingURL=index.js.map