import { Express, NextFunction, Request, Response } from "express";
import { existsSync, realpathSync } from "fs";
import winston from "winston";

export const CustomMiddleware = (app: Express, logger: winston.Logger) => {
    // ==> Define custom middleware
    const GetSpacecraftDataModel = async (request: Request, response: Response, next: NextFunction) => {
        // Get the data model from the template database
        if (!request.body.templateVersion) {
            // template version was not supplied in the request
            logger.info("Request failed to provide a templateVersion field!");
            response.status(400).json({ 'error': 'Failed to supply a templateVersion field with a value in the request body.' });
        }
        else {
            // Get the data model from the template database
            const templatePath = `../../../TemplateDatabase/Spacecraft/v_${request.body.templateVersion}/spacecraft.ts`;
            try {
                const spacecraftDataModel = await import(templatePath);
                // Attach the data model the the response
                response.locals.dataModel = spacecraftDataModel;
                // Move on with the request
                next();
            } catch (error) {
                // Failed to get the data model from the template database
                logger.error(`Failed to import the spacecraft data model (version ${request.body.templateVersion}) from the template database. Error: ${error}`);
                response.status(500).json({ 'error': 'Failed to import template resources for the template version provided' });
            }
        }
    }

    // ==> Apply the custom middleware to the express application
    // Note: Order in which the middleware is applied matters.
    app.use(GetSpacecraftDataModel);
}