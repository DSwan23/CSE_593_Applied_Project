import { Express, Request, Response } from "express";
import winston from "winston";


function routes(app: Express, logger: winston.Logger) {

    // Handle requests from the React Application
    app.get('/api/', (request: Request, response: Response) => {
    });
    // Return the Genesis React Application for all other routes
    app.get('/', (request: Request, response: Response) => {
        response.send('Hello World!');
    });


}

export default routes;