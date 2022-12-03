import { Response } from "express";
import winston from "winston";
import fs from "fs";
import { GetScenarios, GetScenario, UpdateScenario, UpdateTemplate, GetTemplates, GetTemplate, RemoveScenario, RemoveScenarioTemplates, RemoveTemplate, RemoveTemplateFromScenario, RemoveTemplateFromScenarios, AddScenario, AddTemplate, AddTemplateToScenario, ConvertDateToMySqlDate, CreateScenarioDatabase, CreateTemplateTableInDatabase } from "../database/mysqlDatabase";
import { Scenario } from "../models/scenario.interface";
import { Template } from "../models/template.interface";

// --> Scenario helper
/**
 * Updates the last updated date on a scenario.
 * @param scenarioId The scenario id to update the date on
 * @param logger The service logging object
 */
function UpdateDateOnScenario(scenarioId: number, logger: winston.Logger) {
    // Attempt to get the scenario
    GetScenario(scenarioId).then((sceanrio) => {
        // Update the scenario with a new last updated date
        sceanrio.lastUpdated = ConvertDateToMySqlDate(new Date(Date.now()));
        // Call the update but it is unimportant to get a response.
        UpdateScenario(sceanrio);
    }).catch(error => {
        logger.error(`UpdateDateOnScenario Error: ${error}`);
    });
}

// --> Scenario Route Logic
function GetScenariosLogic(response: Response, logger: winston.Logger) {
    // Attempt to get the scenario data from the database
    GetScenarios()
        .then(scenarioData => {
            // Check to see if anything was returned
            if (scenarioData.length == 0) response.status(204).json(scenarioData);
            else response.status(200).json(scenarioData);
        }
        )
        .catch(error => {
            logger.error(`GetScenarios Error: ${error}`);
            response.status(500);
        });
};

function GetScenarioLogic(response: Response, id: number, logger: winston.Logger) {
    // Attempt to get the scenario from the database
    GetScenario(id)
        .then(scenarioData => {
            // Check to see if anything was returned
            if (!scenarioData) response.status(204).json(scenarioData);
            else response.status(200).json(scenarioData);
        })
        .catch(error => {
            logger.error(`GetScenario Error: ${error}`);
            response.status(500);
        });
}

function UpdateScenarioLogic(response: Response, scenario: Scenario, logger: winston.Logger) {
    // Attempt to update the scenario in the database
    UpdateScenario(scenario).then(updatedScenarioData => {
        // Check to see if anything was returned
        if (updatedScenarioData) response.status(200).json(updatedScenarioData);
        else {
            logger.error(`UpdateScenario returned an undefined scenario. Assume update of scenario failed`);
            response.status(500);
        }
    }).catch(error => {
        logger.error(`UpdateScenario Error: ${error}`);
        response.status(500).json({ 'error': error.toString() });
    })
}

function RemoveScenarioLogic(response: Response, scenarioId: number, logger: winston.Logger) {
    // Attempt to remove the scenario from the database
    RemoveScenario(scenarioId).then((removedItemCount) => {
        if (removedItemCount == 1) {
            RemoveScenarioTemplates(scenarioId).then(() => {
                response.status(200).json({ 'info': "Successfully Removed Scenario" });
            }).catch(error => {
                logger.error(`RemoveScenarioTemplates Error : ${error}`);
                response.status(500).json({ 'error': error.toString() });
            });
        }
        else if (removedItemCount == 0) {
            logger.error(`Couldn't find the scenario`);
            response.status(500).json({ 'error': "Scenario could not be found and thus couldn't be removed" });
        }
        else {
            RemoveScenarioTemplates(scenarioId).then(() => {
                response.status(200).json({ 'info': "Successfully Removed Matching Scenarios" });
            }).catch(error => {
                logger.error(`RemoveScenarioTemplates Error : ${error}`);
                response.status(500).json({ 'error': error.toString() });
            });
        }
    }).catch(error => {
        logger.error(`RemoveScenario Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function RemoveTemplateFromScenarioLogic(response: Response, scenarioId: number, templateId: number, logger: winston.Logger) {
    // Attempt to remove a template from a scenario
    RemoveTemplateFromScenario(scenarioId, templateId).then((removedItemCount) => {
        if (removedItemCount == 1) {
            UpdateDateOnScenario(scenarioId, logger);
            response.status(200).json({ 'info': "Successfully Removed Template from Scenario" });
        }
        else if (removedItemCount == 0) {
            logger.error(`Couldn't find either the template or scenario`);
            response.status(500).json({ 'error': "Scenario or Template could not be found and thus couldn't be removed" });
        }
        else {
            UpdateDateOnScenario(scenarioId, logger);
            response.status(200).json({ 'info': "Successfully Removed Matching Templates from Scenario" });
        }
    }).catch(error => {
        logger.error(`RemoveTemplateFromScenario Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function AddScenarioLogic(response: Response, logger: winston.Logger, name: string, description: string, lastUpdated: string) {
    // Create a new scenario object
    let newScenario: Scenario = { name: name, description: description, lastUpdated: lastUpdated, templateIds: [] };
    // Attempt to add that scenario object to the database
    AddScenario(newScenario).then((addedScenario) => {
        // Return the newly added scenario
        response.status(200).json(addedScenario);
    }).catch(error => {
        logger.error(`AddScenario Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
    // Attempt to create a database for the scenario
    CreateScenarioDatabase(newScenario.name).then((result) => {
        // Log that the database was created
        logger.info(`Created a ${newScenario.name} database with the following result: ${result.serverStatus}`);
    }).catch(error => {
        logger.error(`CreateScenarioDatabase Error: ${error}`);
    });
}

// --> Template Route Logic
function GetTemplatesLogic(response: Response, logger: winston.Logger) {
    // Attempt to get the Template data from the database
    GetTemplates()
        .then(templateData => {
            // Check to see if anything was returned
            if (templateData.length == 0) response.status(204).json(templateData);
            else response.status(200).json(templateData);
        }
        )
        .catch(error => {
            logger.error(`GetTemplates Error: ${error}`);
            response.status(500);
        });
};

function GetTemplateLogic(response: Response, id: number, logger: winston.Logger) {
    // Attempt to get the template from the database
    GetTemplate(id)
        .then(templateData => {
            // Check to see if anything was returned
            if (!templateData) response.status(204).json(templateData);
            else response.status(200).json(templateData);
        })
        .catch(error => {
            logger.error(`GetTemplate Error: ${error}`);
            response.status(500);
        });
}

function UpdateTemplateLogic(response: Response, template: Template, logger: winston.Logger) {
    // Check for trailing slashes in the filepath
    let filepath = template.filepath;
    if (filepath.charAt(filepath.length - 1) === '/' || filepath.charAt(filepath.length - 1) === '\\') {
        console.log(filepath);
        template.filepath = filepath.substring(0, filepath.length - 1);
        console.log(template.filepath);
    }
    // Attempt to update the template in the database
    UpdateTemplate(template).then(updatedTemplateData => {
        // Check to see if anything was returned
        if (updatedTemplateData) response.status(200).json(updatedTemplateData);
        else {
            logger.error(`UpdateTemplate returned an undefined template. Assume update of template failed`);
            response.status(500);
        }
    }).catch(error => {
        logger.error(`UpdateTemplate Error: ${error}`);
        response.status(500);
    })
}

function RemoveTemplateLogic(response: Response, templateId: number, logger: winston.Logger) {
    // Attempt to remove the template from the database
    RemoveTemplate(templateId).then((removedItemCount) => {
        if (removedItemCount == 1) {
            RemoveTemplateFromScenarios(templateId).then(() => {
                response.status(200).json({ 'info': "Successfully Removed Template" });
            }).catch(error => {
                logger.error(`RemoveTemplateFromScenarios Error : ${error}`);
                response.status(500).json({ 'error': error.toString() });
            });
        }
        else if (removedItemCount == 0) {
            logger.error(`Couldn't find the template`);
            response.status(500).json({ 'error': "Template could not be found and thus couldn't be removed" });
        }
        else {
            RemoveTemplateFromScenarios(templateId).then(() => {
                response.status(200).json({ 'info': "Successfully Removed Matching Templates" });
            }).catch(error => {
                logger.error(`RemoveTemplateFromScenarios Error : ${error}`);
                response.status(500).json({ 'error': error.toString() });
            });
        }
    }).catch(error => {
        logger.error(`RemoveTemplate Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function AddTemplateLogic(response: Response, logger: winston.Logger, name: string, description: string, version: string, filepath: string) {
    // Check for trailing slashes in the filepath
    if (filepath.charAt(filepath.length - 1) === '/' || filepath.charAt(filepath.length - 1) === '\\') {
        console.log(filepath);
        filepath = filepath.substring(0, filepath.length - 1);
        console.log(filepath);
    }
    // Create a new template object
    let newTemplate: Template = { name: name, description: description, version: version, filepath: filepath };
    // Attempt to add that scenario object to the database
    AddTemplate(newTemplate).then((addedTemplate) => {
        // Return the newly added scenario
        response.status(200).json(addedTemplate);
    }).catch(error => {
        logger.error(`AddTemplate Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function AddTemplateToScenarioLogic(response: Response, logger: winston.Logger, scenarioId: number, templateId: number) {
    // Attempt to add the template to the scenario
    AddTemplateToScenario(scenarioId, templateId).then((updatedScenario) => {
        // Update the scenario with a new last updated date
        updatedScenario.lastUpdated = ConvertDateToMySqlDate(new Date(Date.now()));
        // Call the update but it is unimportant to get a response.
        UpdateScenario(updatedScenario);

        // ==> Add the template table to the scenario database
        // Get the template from the database
        GetTemplate(templateId).then((templateData) => {
            // Get the template create table sql statement from the template database
            fs.readFile(`../TemplateDatabase/${templateData.filepath}/CreateTable.sql`, (err, data) => {
                if (err) {
                    logger.error(`Read CreateTable.sql file read error: ${err}`);
                    return;
                } else {
                    CreateTemplateTableInDatabase(data.toString(), updatedScenario.name).then(result => {
                        logger.info(`Created ${templateData.name} table in ${updatedScenario.name} scenario.`);
                    }).catch(error => {
                        logger.error(`CreateTemplateTableInDatabase error: ${error}`);
                    });
                }
            });
        })

        // Respond to the user
        response.status(200).json(updatedScenario);
    }).catch(error => {
        logger.error(`AddTemplateToScenario Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    })
}

export { GetScenariosLogic, GetScenarioLogic, UpdateScenarioLogic, RemoveScenarioLogic, RemoveTemplateFromScenarioLogic, AddScenarioLogic }
export { GetTemplatesLogic, GetTemplateLogic, UpdateTemplateLogic, RemoveTemplateLogic, AddTemplateLogic, AddTemplateToScenarioLogic as AddTempateToScenarioLogic }