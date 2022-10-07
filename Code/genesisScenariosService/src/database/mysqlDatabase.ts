import { OkPacket, RowDataPacket } from 'mysql2';
import mysql from 'mysql2';
import ServerConfig from '../config/config';
import { ConvertRowEntryToScenario, Scenario } from '../models/scenario.interface';
import { Template } from '../models/template.interface';

// Database connection
const dbConnection = mysql.createConnection({
    host: ServerConfig.dbHost,
    user: ServerConfig.dbUser,
    password: ServerConfig.dbPassword,
    database: ServerConfig.dbSchema
});

export default dbConnection;

// Database Queries

// --> Scenarios

/**
 * Retrieves all of the scenarios records currently stored in the database
 * @returns A Promise that will return an array of the scenario objects currently
 *  stored in the database if fufilled, otherwise the error received from the
 *  database.
 */
function GetScenarios(): Promise<Scenario[]> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT s.*, GROUP_CONCAT(DISTINCT t.pkey ORDER BY t.pkey ASC SEPARATOR ',') as templates FROM scenarios s
            INNER JOIN scenario_templates st ON s.pkey = st.scenario_id
            INNER JOIN templates t ON st.template_id = t.pkey
            GROUP BY s.pkey`,
            (err, results) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Scenario[] = [];
                    results.forEach((entry) => {
                        let scenario: Scenario = ConvertRowEntryToScenario(entry);
                        output.push(scenario);
                    });
                    resolve(output);
                }
            }
        )
    })
};

/**
 * Retrieves a particular scenario based upon it's unique id.
 * @param id The id number of the scenario to retrieve
 * @returns A Promise that will return the first record with the passed id if
 *  fulfilled, otheriwse the error message receieved from the database.
 */
function GetScenario(id: number): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT * FROM scenarios WHERE id = ${id}`,
            (err, results) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Scenario[] = [];
                    results.forEach((entry) => {
                        let scenario: Scenario = ConvertRowEntryToScenario(entry);
                        output.push(scenario);
                    });
                    resolve(output[0]);
                }
            }
        )
    })
};


function CreateScenario(scenario: Scenario): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `INSERT INTO scenarios (name, last_updated, description) VALUES(${scenario.name}, ${scenario.lastUpdated}, ${scenario.description})`,
            (err, result) => {
                // Check for error, otherwise attempt to get the newly created scenario
                if (err) reject(err);
                else {
                    GetScenario(result.insertId)
                        .then(scenario => resolve(scenario!))
                        .catch(reject)
                }
            }
        )
    })
};

function AddTemplateToScenario(scenario: Scenario, template: Template): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `INSERT INTO scenario_templates (scenario_id, template_id) VALUES(${scenario.id}, ${template.id})`,
            (err, result) => {
                // Check for error, otherwise attempt to get the newly created scenario
                if (err) reject(err);
                else {
                    if (!result.insertId)
                        reject("Error in inserting record, Missing Result Insert ID");
                    if (scenario.id)
                        GetScenario(scenario.id)
                            .then(scenario => resolve(scenario!))
                            .catch(reject)
                    else
                        reject("The scenario object provided doesn't have an id value");
                }
            }
        )
    })
};

//TODO: Create MySQL Statements for the Templates, should match the functions for the Scenarios


// Export the queries
export { GetScenarios, GetScenario, CreateScenario, AddTemplateToScenario };