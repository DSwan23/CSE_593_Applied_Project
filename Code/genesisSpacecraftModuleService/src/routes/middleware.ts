import { Express, NextFunction, Request, Response } from "express";
import { existsSync, realpathSync } from "fs";
import path from "path";
import winston from "winston";
import { GetDatabaseTableNames } from "../database/mysqlDatabase";

export const CustomMiddleware = (app: Express, logger: winston.Logger) => {
    // ==> Define custom middleware
    const GetSpacecraftDataModel = async (request: Request, response: Response, next: NextFunction) => {
        // Get the data model from the template database
        let templatePath = request.headers['templatepath'];
        if (!templatePath) {
            // template version was not supplied in the request
            logger.info("Request failed to provide a templatepath Header!");
            response.status(400).json({ 'error': 'Failed to supply a templatepath request header with a value.' });
        }
        else {
            // Get the data model from the template database
            try {
                // Check to see if the filepath ends with a slash
                let lastCharacter = templatePath.slice(-1);
                let endsWithSlash = lastCharacter == "\\" || lastCharacter == "/";
                const spacecraftDataModel = await import(path.resolve(__dirname, `..\\..\\..\\TemplateDatabase\\${templatePath}${endsWithSlash ? "" : "\\"}DataModel.ts`));
                // Attach the data model to the response
                response.locals.dataModel = spacecraftDataModel;
                // Move on with the request
                next();
            } catch (error) {
                // Failed to get the data model from the template database
                logger.error(`Failed to import the spacecraft data model from the template path provided database. Error: ${error}`);
                response.status(500).json({ 'error': 'Failed to import template resources for the template version provided' });
            }
        }
    }

    const GetScenarioName = async (request: Request, response: Response, next: NextFunction) => {
        // Get the scenario name from the request
        let scenarioName = request.headers['scenario'];
        if (!scenarioName) {
            // Scenario name was not supplied in the request
            logger.info("Request failed to provide a scenario Header!");
            response.status(400).json({ 'error': 'Failed to supply a sceanrio request header with a value.' });
        } else {
            // Check to see if the scenario name exists in the database
            GetDatabaseTableNames().then(result => {
                if (!result.find((element: any) => element.schema_name == scenarioName)) {
                    logger.info("Request sent an invalid scenario name!");
                    response.status(400).json({ 'error': 'Scenario name provided does not exist in the database.' });
                } else {
                    // Attach the scenario name to the response
                    response.locals.scenario = scenarioName;
                    // Move on with the request
                    next();
                }
            });
        }
    }

    // ==> Apply the custom middleware to the express application
    // Note: Order in which the middleware is applied matters.
    app.use(GetSpacecraftDataModel, GetScenarioName);
}