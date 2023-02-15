import express from 'express';
import session from 'express-session';
import apiRoutes from './routes/indexRoutes.js';
import * as dotenv from 'dotenv';
import exphbs from 'express-handlebars';


dotenv.config();

const users = [];

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

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));

app.set('view engine', '.hbs');

app.use("/", apiRoutes);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}. at ${new Date().toLocaleString()}`)
});

server.on("error", (err) => {
    console.log(err);
})