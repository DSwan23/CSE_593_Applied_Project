import { OkPacket, RowDataPacket } from 'mysql2';
import mysql from 'mysql2';
import ServerConfig from '../config/config';
import { logger } from 'express-winston';

// Database connection
let dbConnection: mysql.Connection;
function connectToMySql(dbIp: string, dbUsername: string, dbUserPasswword: string) {
    return new Promise((resolve, reject) => {
        dbConnection = mysql.createConnection({
            host: dbIp,
            user: dbUsername,
            password: dbUserPasswword,
        });

        dbConnection.connect(err => {
            if (err) reject(err);
            else resolve('');
        });
    });
};
export default connectToMySql;

// Helper Functions
function ConvertDateToMySqlDate(jsDate: Date): string {
    // create the array to store
    let formattedDate: string[] = [];
    // Add the year
    formattedDate.push(jsDate.getFullYear().toString() + "-");
    // Add the month
    formattedDate.push(("0" + (jsDate.getMonth() + 1)).slice(-2) + "-");
    // Add the day
    formattedDate.push(("0" + jsDate.getDate()).slice(-2) + " ");
    // Add the hours
    formattedDate.push(("0" + jsDate.getHours()).slice(-2) + ":");
    // Add the minutes
    formattedDate.push(("0" + jsDate.getMinutes()).slice(-2) + ":");
    // Add the seconds
    formattedDate.push(("0" + jsDate.getSeconds()).slice(-2));
    // Return the formatted string
    return formattedDate.join('');
}

export { ConvertDateToMySqlDate };

// Database Queries

// --> CRUD
function AddSpacecraft(scenarioName: string, spacecraft: any): Promise<number> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName }, (error) => {
            if (error) reject(error);
        });
        // Run the add query
        dbConnection.query<OkPacket>(
            spacecraft.addQuery(),
            (err, result) => {
                // Check for error, otherwise return the id of the newly inserted object
                if (err) reject(err);
                else {
                    resolve(result.insertId);
                }
            }
        )
    })
};

function GetAllSpacecraft(scenarioName: string, allSpacecraftQuery: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName }, (error) => {
            if (error) reject(error);
        });
        // Run the get al query
        dbConnection.query<RowDataPacket[]>(
            allSpacecraftQuery,
            (err, results) => {
                // Check for error, otherwise return the list of spacecraft
                if (err) reject(err);
                else {
                    resolve(results);
                }
            }
        )
    });
};

function GetSpacecraft(scenarioName: string, singleSpacecraftQuery: string): Promise<any> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName }, (error) => {
            if (error) reject(error);
        });
        // Run the get query
        dbConnection.query<RowDataPacket[]>(
            singleSpacecraftQuery,
            (err, results) => {
                // Check for error, otherwise return the requested spacecraft
                if (err) reject(err);
                else {
                    resolve(results[0]);
                }
            }
        )
    });
};

function UpdateSpacecraft(scenarioName: string, spacecraft: any): Promise<number> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName }, (error) => {
            if (error) reject(error);
        });
        // Run the update query
        dbConnection.query<OkPacket>(
            spacecraft.updateQuery(),
            (err, result) => {
                // Check for error, otherwise return the number of updated rows
                if (err) reject(err);
                else {
                    resolve(result.changedRows);
                }
            }
        )
    });
};

function RemoveSpacecraft(scenarioName: string, spacecraft: any): Promise<number> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName }, (error) => {
            if (error) reject(error);
        });
        // Run the remove query
        dbConnection.query<OkPacket>(
            spacecraft.removeQuery(),
            (err, result) => {
                // Check for error, otherwise return the number of rows that were deleted
                if (err) reject(err);
                else {
                    resolve(result.affectedRows);
                }
            }
        )
    });
};

// Export the queries
export { AddSpacecraft, GetAllSpacecraft, GetSpacecraft, UpdateSpacecraft, RemoveSpacecraft };