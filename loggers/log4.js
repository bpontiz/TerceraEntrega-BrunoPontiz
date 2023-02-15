import log4js from 'log4js';
import * as dotenv from 'dotenv';
dotenv.config();

log4js.configure({
    appenders: {
        consola: { type: 'console' },
        archivoErrores: { type: 'file', filename: 'log/errores.log' },
        archivoDebug: { type: 'file', filename: 'log/debug.log' },
        archivoWarnings: { type: 'file', filename: 'log/warn.log'},
        loggerConsola: { type: 'logLevelFilter', appender: 'consola', level: 'info' },
        loggerArchivoErrores: { type: 'logLevelFilter', appender: 'archivoErrores', level: 'error' },
        loggerArchivoDebug: { type: 'logLevelFilter', appender: 'archivoDebug', level: 'debug' },
        loggerArchivoWarnings: { type: 'logLevelFilter', appender: 'archivoWarnings', level: 'warn' }
    },
    categories: {
        default: {
            appenders: ['loggerConsola'], level: 'all'
        },
        prod: {
            appenders: ['loggerArchivoErrores', 'loggerArchivoDebug', 'archivoWarnings'], level: 'all'
        },
        archivoWarn: {
            appenders: ['archivoWarnings'], level: 'warn'
        },
        archivoDebug: {
            appenders: ['archivoDebug'], level: 'info'
        }
    }
});

let logger = null;

if (process.env.NODE_ENV === 'PROD') {

    logger = log4js.getLogger('prod');

} else {

    logger = log4js.getLogger();
    
}

export default logger;