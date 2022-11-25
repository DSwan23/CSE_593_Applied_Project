import express from 'express';
import helmet from 'helmet';
import ServerConfig from './config/config';
import './database/mysqlDatabase';
import routes from './routes/routes';
import winston, { createLogger } from 'winston';
import { logger, errorLogger } from 'express-winston';
import connectToMySql from './database/mysqlDatabase';
import redisConnection, { getIpAddress } from './database/redisDatabase';
import { CustomMiddleware } from './routes/middleware';
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

// Connect to the database
connectToMySql(ServerConfig.dbHostIp, ServerConfig.dbUsername, ServerConfig.dbPassword)
    .then(() => { commonLogger.info(`Successfully connected to database at ${ServerConfig.dbHostIp}`); })
    .catch((error) => { commonLogger.error(`Failed to connect to database at ${ServerConfig.dbHostIp} because ${error}`) });

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
// Apply custom middleware
CustomMiddleware(app, commonLogger);

// Setup the routes to be used by this service
routes(app, commonLogger);

// More middleware, after the routing logic has occurred
// Log any error responses
app.use(expressErrLogger);

// Start the server listening on our port
app.listen(ServerConfig.port, () => {
    commonLogger.info(`Genesis Module Service Started, Listening on port ${ServerConfig.port}`);
})