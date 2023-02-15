import { Router } from 'express';
import calculate from '../calculate.js';
import compression from 'compression';
import os from 'os';
import logger from '../loggers/log4.js';
import passport from 'passport';
import users from '../server.js';


const apiRoutes = Router();


const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {

        next();

    } else {

        res.redirect('/login');

    };
};

apiRoutes.get('/', isAuth, (req, res) => {

    res.redirect('/data');

});

apiRoutes.get('/', (req, res) => {
    const { url, method } = req.body;
    
    logger.info(`Redirecting to ${url} with method ${method}.`)

    if (req.session.username) {

        res.redirect('/data');

    } else {

        res.redirect('/login');

    }


});

apiRoutes.get('/register', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    res.sendFile('register.html', {root: 'views'});
});

apiRoutes.post('/register', 
    passport.authenticate('register', 
        { 
            successRedirect: '/login-ok',
            failureRedirect: '/failregister'
        }
    )
);

apiRoutes.get('/failregister', (req, res) => {

    res.render('register-error');

})

apiRoutes.get('/login', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    res.sendFile('login.html', {root: 'views'});
});

apiRoutes.post('/login', 
    passport.authenticate('login', 
        { 
            failureRedirect: '/faillogin', 
            successRedirect: '/data' 
        }
    )
);

apiRoutes.get('/faillogin', (req, res) => {

    res.render('login-error');

})

apiRoutes.get('/login-ok', (req, res) => {

    res.sendFile('login-ok.html', {root: 'views'});

})

apiRoutes.post('/login-ok', (req, res) => {

    const {username, password} = req.body;

    const user = users.find(u => u.username == username && u.password == password);

    if (!user) {

        return res.render('login-error');

    } else {

        req.session.username = username;

        req.session.contador = 0;
        
        res.redirect('/data');

    }

})


apiRoutes.get('/data', isAuth, 
    (req, res) => {

        if(!req.user.contador) {

            req.user.contador = 0;

        }

        req.user.contador++;

        res.render('data', {

            data: users.find(u => u.username === req.user.username),
            contador: req.user.contador

        });
    }
);

apiRoutes.get('/logout', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    req.logout();

    res.redirect('/');

});

apiRoutes.get('/info', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    const directory = process.cwd();
    
    const id = process.pid;

    const nodeVersion = process.version;

    const memory = process.memoryUsage();

    const platform = process.platform;

    const inputArgs = process.argv.slice(2).length == 0
        ? 'No argument inputs'
        : process.argv.slice(2);

    const numProcessors = os.cpus().length;

    const processVariables = {directory, id, nodeVersion, memory, platform, inputArgs, numProcessors};

    res.json(processVariables);
});

apiRoutes.get('/info/compression', compression(), (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    const directory = process.cwd();
    
    const id = process.pid;

    const nodeVersion = process.version;

    const memory = process.memoryUsage();

    const platform = process.platform;

    const inputArgs = process.argv.slice(2).length == 0
        ? 'No argument inputs'
        : process.argv.slice(2);

    const numProcessors = os.cpus().length;

    const processVariables = {directory, id, nodeVersion, memory, platform, inputArgs, numProcessors};

    res.json(processVariables);
});

apiRoutes.get('/api/randoms/:number', (req, res) => {

    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    const reqNumber = Number(req.params.number);

    const calculation = calculate(reqNumber);

    console.log(calculation);

});

apiRoutes.get('*', (req, res) => {

    const { url, method } = req;

    logger.warn(`Cannot redirect to ${url} with method ${method} because is not implemented.`);

    res.status(404).send(`<b>404 ERROR</b> - Could not find ${url} resource.`);

});

export default apiRoutes;