import express from 'express';
import helmet from 'helmet';
import ServerConfig from './config/config';
import './database/mysqlDatabase';
import routes from './routes/routes';
import winston, { createLogger } from 'winston';
import { logger, errorLogger } from 'express-winston';
import cors from 'cors';


// --> Setup logging
// configure the winston logger
const { combine, timestamp, cli, json, label } = winston.format;
export const commonLogger = createLogger({
    level: 'debug',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({ filename: 'src\\logs\\error.log.json', level: 'error' }),
        new winston.transports.File({ filename: 'src\\logs\\server.log.json' }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'src\\logs\\exception.log.json' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'src\\logs\\promiseRejections.log.json' }),
    ],
});

// configure express-winston logger, as middleware for catching requests and responses
const expressReqLogger = logger({
    winstonInstance: commonLogger,
});
const expressErrLogger = errorLogger({
    winstonInstance: commonLogger,
});

// Add console as logger if we are in debug mode
if (ServerConfig.debug) {
    commonLogger.add(new winston.transports.Console({
        format: combine(timestamp(), label({ label: "Service Debug", message: true }), cli()),
    }))
}

// Create our express application
const app = express();

// --> Middleware
// Log any incoming requests
app.use(expressReqLogger);
// Allow CORS
app.use(cors());
// Basic Security
app.use(helmet({ contentSecurityPolicy: false, }));
// Parse request json data
app.use(express.json());

// Setup the routes to be used by this service
routes(app, commonLogger);

// More middleware
// Log any error responses
app.use(expressErrLogger);

// export the app so it may be used
export default app;