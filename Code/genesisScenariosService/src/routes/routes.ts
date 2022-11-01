import { Express, Request, Response } from "express";
import winston from "winston";
import { ConvertDateToMySqlDate } from "../database/mysqlDatabase";
import { ConvertJsonToScenario, Scenario } from "../models/scenario.interface";
import { ConvertJsonToTemplate, Template } from "../models/template.interface";
import { GetScenariosLogic, GetScenarioLogic, UpdateScenarioLogic, UpdateTemplateLogic, GetTemplatesLogic, GetTemplateLogic, RemoveTemplateLogic, RemoveTemplateFromScenarioLogic, AddTemplateLogic, AddScenarioLogic, AddTempateToScenarioLogic } from "./routeLogic";


function routes(app: Express, logger: winston.Logger) {

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
    app.post('/scenarios/add', (request: Request, response: Response) => {
        // Make sure all of the data was delivered from the request
        if (request.body.name && request.body.Description) {
            try {
                // Attempt to add passed data to variables
                let scnName: string = request.body.name;
                let scnDescription: string = request.body.Description;
                // Get today's date
                let scnLastUpdated: string = ConvertDateToMySqlDate(new Date(Date.now()));
                AddScenarioLogic(response, logger, scnName, scnDescription, scnLastUpdated);
            } catch (error) {
                logger.info("Request provided an incorrect data type for at least one scenario field");
                response.status(400).json({ 'error': 'The passed scenario object field had an incorrect data type, should all have the string type' });
            }
        }
        else {
            logger.info("Request failed to provide all of the required scenario fields");
            response.status(400).json({ 'error': 'Missing a field in the passed scenario object, should have (name and description)' });
        }
    });
    app.post('/scenarios/:sid/add/template/:tid', (request: Request, response: Response) => {
        let scenarioId: number = Number(request.params.sid);
        let templateId: number = Number(request.params.tid);
        if (scenarioId && templateId) AddTempateToScenarioLogic(response, logger, scenarioId, templateId);
        else {
            logger.info("Request Provided an id(s) that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id(s) requested is/are not a number' });
        }
    });

    // (READ)
    app.get('/scenarios', (request: Request, response: Response) => { GetScenariosLogic(response, logger); });
    app.get('/scenarios/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (id) GetScenarioLogic(response, id, logger);
        else {
            logger.info("Request Provided an id that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id requested is not a number' });
        }
    });

    // (UPDATE)
    app.put('/scenarios/update', (request: Request, response: Response) => {
        let updatedScenario: Scenario | undefined = ConvertJsonToScenario(request.body);
        if (updatedScenario) {
            updatedScenario.lastUpdated = ConvertDateToMySqlDate(new Date(Date.now()));
            UpdateScenarioLogic(response, updatedScenario, logger);
        } else {
            response.status(400).json({ 'error': 'Incorrect Scenario Object format. Format: {id: number, name: string, lastUpdated: string, description: string, templateIds: Array<number>}' });
        }
    });

    // (DESTROY)
    app.delete('/scenarios/remove/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (id) RemoveTemplateLogic(response, id, logger);
        else {
            logger.info("Request Provided an id that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id requested is not a number' });
        }
    });
    app.delete('/scenarios/:sid/remove/template/:tid', (request: Request, response: Response) => {
        let scenarioId: number = Number(request.params.sid);
        let templateId: number = Number(request.params.tid);
        if (scenarioId && templateId) RemoveTemplateFromScenarioLogic(response, scenarioId, templateId, logger);
        else {
            logger.info("Request Provided an id(s) that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id(s) requested is/are not a number' });
        }
    });

    // --> Template Routes
    // (CREATE)
    app.post('/templates/add', (request: Request, response: Response) => {
        // Make sure all of the data was delivered from the request
        if (request.body.name && request.body.version && request.body.filepath && request.body.Description) {
            try {
                let tempName: string = request.body.name;
                let tempVersion: string = request.body.version;
                let tempFilePath: string = request.body.filepath;
                let tempDescription: string = request.body.Description;
                AddTemplateLogic(response, logger, tempName, tempVersion, tempFilePath, tempDescription);
            } catch (error) {
                logger.info("Request provided an incorrect data type for at least one template field");
                response.status(400).json({ 'error': 'The passed template object field had an incorrect data type, should all have the string type' });
            }
        }
        else {
            logger.info("Request failed to provide all of the required template fields");
            response.status(400).json({ 'error': 'Missing a field in the passed template object, should have (name, filepath, version, and description)' });
        }
    });

    // (READ)
    app.get('/templates', (request: Request, response: Response) => { GetTemplatesLogic(response, logger) });
    app.get('/templates/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (id) GetTemplateLogic(response, id, logger);
        else {
            logger.info("Request Provided an id that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id requested is not a number' });
        }
    });

    // (UPDATE)
    app.put('/templates/update', (request: Request, response: Response) => {
        let updatedTemplate: Template | undefined = ConvertJsonToTemplate(request.body);
        if (updatedTemplate) {
            UpdateTemplateLogic(response, updatedTemplate, logger);
        } else {
            response.status(400).json({ 'error': 'Incorrect Template Object format. Format: {id: number, name: string, version: string, filePath: string, description: string}' });
        }
    });

    // (DESTROY)
    app.delete('/templates/remove/:id', (request: Request, response: Response) => {
        let id: number = Number(request.params.id);
        if (id) RemoveTemplateLogic(response, id, logger);
        else {
            logger.info("Request Provided an id that couldn't be converted into a number");
            response.status(400).json({ 'error': 'Id requested is not a number' });
        }
    });

}

export default routes;