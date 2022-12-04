import express from 'express';
import path from 'path';
import routes from './routes/routes';
import winston, { createLogger } from 'winston';
import { logger, errorLogger } from 'express-winston';
import helmet from 'helmet';
import ServerConfig from './config/config';
import redisConnection from './database/redisDatabase';
import cors from 'cors';

// --> Setup logging
// configure the winston logger
const { combine, timestamp, cli, json, label } = winston.format;
const commonLogger = createLogger({
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

// Connect to redis database
redisConnection(ServerConfig, commonLogger);

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

// Set the this front end server to serve the React Application Files
// Allows us to serve the react application we built from this node server
console.log(path.resolve(__dirname, '../../TemplateDatabase'));
app.use(express.static(path.resolve(__dirname, '../../genesisFrontEnd/dist/')));

// Set this front end server to serve the template flat file database
app.use('/TemplateDatabase', express.static(path.resolve(__dirname, '../../TemplateDatabase')));

// Setup the routes to be used by this service
routes(app, commonLogger);

// Setup the Socket IO connection

// More middleware
// Log any error responses
app.use(expressErrLogger);

// Start the server listening on our port
app.listen(ServerConfig.port, () => {
    commonLogger.info(`Genesis Front End Server Started, Listening on port ${ServerConfig.port}`);
})