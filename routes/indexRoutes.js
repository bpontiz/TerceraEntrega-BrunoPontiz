import { Router } from 'express';
import calculate from '../calculate.js';
import compression from 'compression';
import os from 'os';
import logger from '../loggers/log4.js';

const apiRoutes = Router();

const users = [];

apiRoutes.get('/', (req, res) => {
    const { url, method } = req.body;
    
    logger.info(`Redirecting to ${url} with method ${method}.`)

    if (req.session.name) {

        res.redirect('/datos');

    } else {

        res.redirect('/login');

    }


});

apiRoutes.get('/register', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    res.sendFile('register.html', {root: 'views'});
});

apiRoutes.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const user = users.find(u => u.name == name);

    if (user) {

        return res.render('register-error');

    } else {

        users.push({name, email, password});

        return res.redirect('login-ok');

    }

}
);

apiRoutes.get('/login', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    res.sendFile('login.html', {root: 'views'});
});

apiRoutes.post('/login', (req, res) => {
    const {name, password} = req.body;

    const user = users.find(u => u.name == name && u.password == password);

    if (!user) {

        return res.render('login-error');

    } else {

        req.session.name = name;

        req.session.contador = 0;
        
        res.redirect('data');

    }
});

apiRoutes.get('/login-ok', (req, res) => {

    res.sendFile('login-ok.html', {root: 'views'});

})

apiRoutes.post('/login-ok', (req, res) => {

    const {name, password} = req.body;

    const user = users.find(u => u.name == name && u.password == password);

    if (!user) {

        return res.render('login-error');

    } else {

        req.session.name = name;

        req.session.contador = 0;
        
        res.redirect('data');

    }

})


apiRoutes.get('/data', (req, res) => {

    if (req.session.name) {

        req.session.contador++;

        return res.render('data',
            {
                data: users.find(u => u.name == req.session.name),
                contador: req.session.contador
            });

    } else {

        return res.redirect('/login');

    }
});

apiRoutes.get('/logout', (req, res) => {
    const { url, method } = req;

    logger.info(`Redirecting to ${url} with method ${method}.`);

    req.session.destroy(err => {
        res.redirect('/login')
    });
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