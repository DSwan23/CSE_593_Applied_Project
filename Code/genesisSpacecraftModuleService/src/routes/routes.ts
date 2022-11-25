import { Express, Request, Response } from "express";
import winston from "winston";
import { ConvertDateToMySqlDate } from "../database/mysqlDatabase";
import { AddSpacecraftLogic, GetAllSpacecraftLogic, GetSpacecraftLogic, RemoveSpacecraftLogic, UpdateSpacecraftLogic } from "./routeLogic";


const routes = (app: Express, logger: winston.Logger) => {

    // API Documentation
    // TODO: Return html and json objects upon request
    app.get('/', (request: Request, response: Response) => {
        // Get the requested content type
        let contentRequested = request.header("Content-Type");
        // Check to see if content wasn't specified
        if (contentRequested) response.send('Need to specify Content-Type in request');
        // Determine if html was requested
        else if (contentRequested === "text/html") {
            // Send html version of the API reference
        }
        else if (contentRequested === "application/json") {
            // Send JSON version of the API
        }
        else {
            // Content-Type not supported
            response.send(`${contentRequested} is not supported. Select either text/html or application/json`);
        }
    });

    // --> Scenario Routes
    // (CREATE)
    app.post('/spacecraft/add', async (request: Request, response: Response) => {
        // Attempt to create a template spacecraft object from the data provided
        let spacecraft = new response.locals.dataModel.Spacecraft(request.body);
        if (spacecraft.validateSpacecraft() && request.body.scenarioName) {
            // Add the spacecraft to the database
            AddSpacecraftLogic(response, logger, spacecraft, request.body.scenarioName);
        }
        else {
            logger.info("Request failed to provide all of the required spacecraft fields or the scenario name");
            response.status(400).json({ 'error': 'Missing either the scenario name or a field in the passed spacecraft object, should have (name, constellation, rx, ry, rz, vx, vy, vz)' });
        }
    });

    // (READ)
    app.get('/spacecraft', (request: Request, response: Response) => {
        // Create an empty template spacecraft object, access to the queries within the object
        let spacecraft = new response.locals.dataModel.Spacecraft();
        if (response.locals.scenario) {
            // Proceed with the request
            GetAllSpacecraftLogic(response, logger, spacecraft, response.locals.scenario);
        } else {
            logger.info("Request failed to provide the scenario name in which to get the spacecraft from");
            response.status(400).json({ 'error': 'Missing the scenario name in the request' });
        }
    });

    app.get('/spacecraft/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (request.body.scenarioName && id) {
            // Create a template spacecraft object, access to the queries within the object
            let spacecraft = new response.locals.dataModel.Spacecraft({ 'id': id });
            // Proceed with the request
            GetSpacecraftLogic(response, logger, spacecraft, request.body.scenarioName);
        } else {
            logger.info("Request failed to provide the scenario name in which to get the spacecraft from or a valid id number");
            response.status(400).json({ 'error': 'Missing the scenario name in the request or id was not a number' });
        }
    });

    // (UPDATE)
    app.put('/spacecraft/update', (request: Request, response: Response) => {
        // Attempt to create a template spacecraft object from the data provided
        let spacecraft = new response.locals.dataModel.Spacecraft(request.body);
        if (spacecraft.validateSpacecraft() && request.body.scenarioName) {
            // Add the spacecraft to the database
            UpdateSpacecraftLogic(response, logger, spacecraft, request.body.scenarioName);
        }
        else {
            logger.info("Request failed to provide all of the required spacecraft fields or the scenario name");
            response.status(400).json({ 'error': 'Missing either the scenario name or a field in the passed spacecraft object, should have (name, constellation, rx, ry, rz, vx, vy, vz)' });
        }
    });

    // (DESTROY)
    app.delete('/spacecraft/remove/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (request.body.scenarioName && id) {
            // Create a template spacecraft object, access to the queries within the object
            let spacecraft = new response.locals.dataModel.Spacecraft({ 'id': id });
            // Proceed with the request
            RemoveSpacecraftLogic(response, logger, spacecraft, request.body.scenarioName);
        } else {
            logger.info("Request failed to provide the scenario name in which to get the spacecraft from or a valid id number");
            response.status(400).json({ 'error': 'Missing the scenario name in the request or id was not a number' });
        }
    });
}

export default routes;