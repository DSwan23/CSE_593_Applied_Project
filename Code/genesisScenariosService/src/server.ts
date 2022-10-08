import express from 'express';
import helmet from 'helmet';
import ServerConfig from './config/config';
import './database/mysqlDatabase';
import { GetScenarios, GetTemplate, GetTemplates } from './database/mysqlDatabase';
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
// GetScenarios().then((values) => {
//     console.log(values[0]);
// });

// GetTemplate(3).then((template) => {
//     console.log(template);
// });

// GetTemplates().then((templates) => {
//     console.log(templates);
// });

// Setup the routes to be used by this service
routes(app);

// Start the server listening on our port
app.listen(ServerConfig.port, () => {
    console.log(`Listening on port ${ServerConfig.port}`);
})