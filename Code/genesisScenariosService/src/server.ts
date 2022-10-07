import express from 'express';
import helmet from 'helmet';
import ServerConfig from './config/config';
import './database/mysqlDatabase';
import { GetScenarios } from './database/mysqlDatabase';
import routes from './routes/routes';
import { Scenario } from './models/scenario.interface';

// Create our express application
const app = express();

// --> Middleware
// Basic Security 
app.use(helmet());
// Parse request json data
app.use(express.json());

// Ceate a database connection
// const db = mysql.createConnection({
//     host: ServerConfig.dbHost,
//     user: ServerConfig.dbUser,
//     password: ServerConfig.dbPassword,
//     database: ServerConfig.dbSchema
// });

// Debug database connection
GetScenarios().then((values) => {
    console.log(values[0]);
});

// Setup the routes to be used by this service
routes(app);

// Start the server listening on our port
// TODO: Make the port configurable
app.listen(ServerConfig.port, () => {
    console.log(`Listening on port ${ServerConfig.port}`);
})