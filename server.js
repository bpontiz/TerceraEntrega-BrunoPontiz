import express from 'express';
import session from 'express-session';
import apiRoutes from './routes/indexRoutes.js';
import * as dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import './routes/indexRoutes.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

dotenv.config();

const users = [];

passport.use('register', new LocalStrategy({
    passReqToCallback: true
    }, (req, username, password, done) => {

        const {email} = req.body;

        const user = users.find(u => u.username === username);

        if (user) {
            return done('User already registered.');
        }

        const newUser = {
            username,
            password,
            email,
        };

        users.push(newUser)

        return done(null, newUser)
    }
));

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username)

        if (!user) {
            return done(null, false)
        }
    
        if (user.password !== password) {
            return done(null, false)
        }
    
        user.contador = 0;

        return done(null, user)
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username);
    }
);

passport.deserializeUser(function (username, done) {
    const user = users.find(u => u.username === username)
    done(null, user);
    }
);

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //Expires in 10 (minutes)
        maxAge: 600000
    }
}))

app.use(passport.initialize());

app.use(passport.session());

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));

app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.use("/", apiRoutes);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}. at ${new Date().toLocaleString()}`)
});

server.on("error", (err) => {
    console.log(err);
})
