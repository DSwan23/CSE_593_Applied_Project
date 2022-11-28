import { Response } from "express";
import winston from "winston";
import { AddSpacecraft, GetAllSpacecraft, GetSpacecraft, RemoveSpacecraft, UpdateSpacecraft } from "../database/mysqlDatabase";


// --> Route Logic functions
function AddSpacecraftLogic(response: Response, logger: winston.Logger, spacecraft: any, sceanrioName: string) {
    // Attempt to add that scenario object to the database
    AddSpacecraft(sceanrioName, spacecraft).then((addedSpacecraftId) => {
        // Attempt to get the newly added spacecraft from the database
        GetSpacecraft(sceanrioName, spacecraft.selectOneQuery(addedSpacecraftId)).then(result => {
            // Return the newly added scenario
            response.status(200).json(result);
        }).catch(error => {
            logger.error(`AddSpacecraft Error : ${error}`);
            response.status(500).json({ 'error': error.toString() });
        });
    }).catch(error => {
        logger.error(`AddSpacecraft Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function GetAllSpacecraftLogic(response: Response, logger: winston.Logger, spacecraft: any, sceanrioName: string) {
    // Attempt to get all of the spacecraft stored in the database
    GetAllSpacecraft(sceanrioName, spacecraft.selectAllQuery()).then(entryArray => {
        // Check to see if anything was returned
        if (entryArray.length == 0) response.status(204).json(entryArray);
        else response.status(200).json(entryArray);
    }).catch(error => {
        logger.error(`GetAllSpacecraft Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function GetSpacecraftLogic(response: Response, logger: winston.Logger, spacecraft: any, sceanrioName: string) {
    // Attempt to get a spacecraft stored in the database
    GetSpacecraft(sceanrioName, spacecraft.selectOneQuery()).then(entry => {
        // Check to see if anything was returned
        if (!entry) response.status(204).json(entry);
        else response.status(200).json(entry);
    }).catch(error => {
        logger.error(`GetSpacecraft Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function UpdateSpacecraftLogic(response: Response, logger: winston.Logger, spacecraft: any, sceanrioName: string) {
    // Attempt to update the spacecraft in the database
    UpdateSpacecraft(sceanrioName, spacecraft).then(numberOfEntriesUpdated => {
        logger.info(`Update on spacecraft id ${spacecraft.id} resulted in ${numberOfEntriesUpdated} updated entries.`);
        // Attempt to get the newly updated spacecraft from the database
        GetSpacecraft(sceanrioName, spacecraft.selectOneQuery()).then(result => {
            // Return the newly added scenario
            response.status(200).json(result);
        }).catch(error => {
            logger.error(`AddSpacecraft Error : ${error}`);
            response.status(500).json({ 'error': error.toString() });
        });
    }).catch(error => {
        logger.error(`UpdateSpacecraft Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

function RemoveSpacecraftLogic(response: Response, logger: winston.Logger, spacecraft: any, sceanrioName: string) {
    // Attempt to remove a spacecraft in the database
    RemoveSpacecraft(sceanrioName, spacecraft).then(numberOfEntriesRemoved => {
        logger.info(`removal of spacecraft id ${spacecraft.id} resulted in ${numberOfEntriesRemoved} removed entries.`);
        response.status(200).json({ 'info': "Successfully Removed Spacecraft" });
    }).catch(error => {
        logger.error(`RemoveSpacecraft Error : ${error}`);
        response.status(500).json({ 'error': error.toString() });
    });
}

export { AddSpacecraftLogic, GetAllSpacecraftLogic, GetSpacecraftLogic, UpdateSpacecraftLogic, RemoveSpacecraftLogic }