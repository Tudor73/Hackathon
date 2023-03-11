import express  from "express";
import passport from "passport";
import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entities/User";
// import {Strategy as GitHubStrategy} from "passport-github";


const root = __dirname + "/..";

const AppDataSource = new DataSource({
    type: "sqlite",
    database: `${root}/data/db.sqlite`,
    entities: [User],
});

AppDataSource.initialize().then(() => {

}).catch((err) => {
    console.log(err);
})


// passport.use(new GitHubStrategy({
//     clientID: GITHUB_CLIENT_ID,
//     clientSecret: GITHUB_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/github/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ githubId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


const app = express();
app.use(passport.initialize())

passport.serializeUser(function(user:any, done:any) {
    done(null, user.id);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

