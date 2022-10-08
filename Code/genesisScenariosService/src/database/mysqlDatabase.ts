import { OkPacket, RowDataPacket } from 'mysql2';
import mysql from 'mysql2';
import ServerConfig from '../config/config';
import { ConvertRowEntryToScenario, Scenario } from '../models/scenario.interface';
import { ConvertRowEntryToTemplate, Template } from '../models/template.interface';

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
            `SELECT * FROM scenarios WHERE pkey = ${id}`,
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

/**
 * Adds a new scenario to the database.
 * @param scenario The scenario object to add to the database
 * @returns The scenario object as it appears in the database, with it's assigned id.
 */
function AddScenario(scenario: Scenario): Promise<Scenario> {
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

/**
 * Adds a template to a scenario.
 * @param scenario The scenario object to assign the template to
 * @param template The template object being assigned
 * @returns The scenario object as it appears in the database.
 */
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
                            .then(scenari => resolve(scenari!))
                            .catch(reject)
                    else
                        reject("The scenario object provided doesn't have an id value");
                }
            }
        )
    })
};

// --> Templates

/**
 * Retrieves all of the template records from the database.
 * @returns An array of all of the templates currently stored in the database
 */
function GetTemplates(): Promise<Template[]> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT * FROM templates`,
            (err, results) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Template[] = [];
                    results.forEach((entry) => {
                        let template: Template = ConvertRowEntryToTemplate(entry);
                        output.push(template);
                    });
                    resolve(output);
                }
            }
        )
    });
}

/**
 * Attempts to get a specific template based upon its unique id.
 * @param id The id of the template to retrieve
 * @returns The first template object matching the passed id, undefined otherwise
 */
function GetTemplate(id: number): Promise<Template> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT * FROM templates WHERE pkey = ${id}`,
            (err, results) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Template[] = [];
                    results.forEach((entry) => {
                        let template: Template = ConvertRowEntryToTemplate(entry);
                        output.push(template);
                    });
                    resolve(output[0]);
                }
            }
        )
    });
}

/**
 * Adds a new template to the database.
 * @param template The template object to store in the database
 * @returns The template object as it appears in the database
 */
function AddTemplate(template: Template): Promise<Template> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `INSERT INTO scenarios (name, version, filePath, description, deprecated) VALUES(${template.name}, ${template.version},${template.filePath}, ${template.description},${template.deprecated})`,
            (err, result) => {
                // Check for error, otherwise attempt to get the newly created template
                if (err) reject(err);
                else {
                    GetTemplate(result.insertId)
                        .then(templat => resolve(templat!))
                        .catch(reject)
                }
            }
        )
    });
}


// Export the queries
export { GetScenarios, GetScenario, AddScenario, AddTemplateToScenario, GetTemplates, GetTemplate, AddTemplate };