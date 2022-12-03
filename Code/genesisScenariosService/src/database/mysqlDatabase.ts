import { OkPacket, RowDataPacket } from 'mysql2';
import mysql from 'mysql2';
import ServerConfig from '../config/config';
import { ConvertRowEntryToScenario, Scenario } from '../models/scenario.interface';
import { ConvertRowEntryToTemplate, Template } from '../models/template.interface';

// Module level variables
let genesisSchema: string;

// Database connection
let dbConnection: mysql.Connection;
function connectToMySql(dbIp: string, dbUsername: string, dbUserPassword: string, dbSchema: string) {
    genesisSchema = dbSchema;
    return new Promise((resolve, reject) => {
        dbConnection = mysql.createConnection({
            host: dbIp,
            user: dbUsername,
            password: dbUserPassword,
            database: dbSchema
        });

        dbConnection.connect(err => {
            if (err) reject(err);
            else resolve('');
        });
    });
};
export default connectToMySql;

// Helper Functions
/**
 * Converts a javascript date into a date string that is understood by MySQL
 * @param jsDate The javascript date object to convert
 * @returns The string representation of the passed date in the MySQL format.
 */
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

// --> Scenarios

/**
 * Retrieves all of the scenarios records currently stored in the database
 * @returns A Promise that will return an array of the scenario objects currently
 *  stored in the database if fufilled, otherwise undefined empty array.
 */
function GetScenarios(): Promise<Scenario[]> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT s.*, GROUP_CONCAT(DISTINCT t.pkey ORDER BY t.pkey ASC SEPARATOR ',') as templates FROM scenarios s
            LEFT JOIN scenario_templates st ON s.pkey = st.scenario_id
            LEFT JOIN templates t ON st.template_id = t.pkey
            GROUP BY s.pkey`,
            (err: any, results: any) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Scenario[] = [];
                    results.forEach((entry: any) => {
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
 *  fulfilled, otherwise undefined.
 */
function GetScenario(id: number): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT s.*, GROUP_CONCAT(DISTINCT t.pkey ORDER BY t.pkey ASC SEPARATOR ',') as templates FROM scenarios s
            LEFT JOIN scenario_templates st ON s.pkey = st.scenario_id
            LEFT JOIN templates t ON st.template_id = t.pkey
            WHERE s.pkey = ${id} GROUP BY s.pkey`,
            (err: any, results: any[]) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Scenario[] = [];
                    results.forEach((entry) => {
                        let scenario: Scenario = ConvertRowEntryToScenario(entry);
                        output.push(scenario);
                    });
                    resolve(output[0] as Scenario);
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
            `INSERT INTO scenarios (name, last_updated, description) VALUES ('${scenario.name}', '${scenario.lastUpdated}', '${scenario.description}')`,
            (err: any, result: { insertId: number; }) => {
                // Check for error, otherwise attempt to get the newly created scenario
                if (err) reject(err);
                else {
                    GetScenario(result.insertId)
                        .then(scenari => resolve(scenari!))
                        .catch(reject)
                }
            }
        )
    })
};
/**
 * Attempts to create a database with the scenario name provided.
 * @param scenarioName The name of the scenario we are creating a database for
 * @returns The query OkPacket.
 */
function CreateScenarioDatabase(scenarioName: string): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `CREATE DATABASE ${scenarioName.split(" ").join("_")}`,
            (err: any, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            }
        )
    });
}

/**
 * Updates the scenario record in the database to match the passed scenario object.
 * @param scenario the scenario object to update in the database
 * @returns The updated scenario object as it appears in the database, otherwise undefined.
 */
function UpdateScenario(scenario: Scenario): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `UPDATE scenarios SET name='${scenario.name}', last_updated='${scenario.lastUpdated}', description='${scenario.description}' WHERE pkey=${scenario.id}`,
            (err: any, result: any) => {
                // Check for an error, otherwise return the updated template
                if (err) reject(err);
                else {
                    GetScenario(scenario.id as number)
                        .then(scenari => resolve(scenari!))
                        .catch(reject)
                }
            }
        )
    });
};

/**
 * Attempts to remove the scenario from the database
 * @param scenarioId The scenarioId to remove from the database.
 * @returns The number of items removed from the database.
 */
function RemoveScenario(scenarioId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `DELETE FROM scenarios WHERE pkey=${scenarioId}`,
            (err: any, result: { affectedRows: number | PromiseLike<number>; }) => {
                // Check for an error, otherwise return the updated template
                if (err) reject(err);
                else resolve(result.affectedRows);
            }
        )
    });
};


// --> Scenario Template Connections

/**
 * Adds a template to a scenario.
 * @param scenarioId The scenarioId to assign the template to
 * @param templateId The templateId being assigned
 * @returns The scenario object as it appears in the database.
 */
function AddTemplateToScenario(scenarioId: number, templateId: number): Promise<Scenario> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `INSERT INTO scenario_templates (scenario_id, template_id) VALUES(${scenarioId}, ${templateId})`,
            (err: any, result: { insertId: any; }) => {
                // Check for error, otherwise attempt to get the newly created scenario
                if (err) reject(err);
                else {
                    if (!result.insertId)
                        reject("Error in inserting record, Missing Result Insert ID");
                    if (scenarioId)
                        GetScenario(scenarioId)
                            .then(scenari => resolve(scenari!))
                            .catch(reject)
                    else
                        reject("The scenario object provided doesn't have an id value");
                }
            }
        )
    })
};

function CreateTemplateTableInDatabase(createTableQuery: string, scenarioName: string): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
        // Switch connection over to the scenario database
        dbConnection.changeUser({ "database": scenarioName.split(" ").join("_") }, (error) => {
            if (error) reject(error);
        });
        dbConnection.query<OkPacket>(
            createTableQuery,
            (err: any, result) => {
                // Return connection back to the genesis scenario database
                dbConnection.changeUser({ "database": genesisSchema }, (error) => {
                    if (error) reject(error);
                });
                // Check for error, otherwise attempt to get the newly created scenario
                if (err) reject(err);
                else {
                    resolve(result);
                }
            }
        )
    })
};

/**
 * Removes a template from a scenario.
 * @param scenarioId The scenarioId containing the template.
 * @param templateId The templateId to be removed from the scenario.
 * @returns The number of items removed.
 */
function RemoveTemplateFromScenario(scenarioId: number, templateId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `DELETE FROM scenario_templates WHERE scenario_id=${scenarioId} AND template_id=${templateId}`,
            (err: any, result: { affectedRows: number | PromiseLike<number>; }) => {
                // Check for error, otherwise return the number of removed entries
                if (err) reject(err);
                else resolve(result.affectedRows);
            }
        )
    })
};

/**
 * Removes the templates connected to a specified scenario.
 * @param scenarioId The scenarioId being removed
 * @returns The number of items removed from the database.
 */
function RemoveScenarioTemplates(scenarioId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `DELETE FROM scenario_templates WHERE scenario_id=${scenarioId}`,
            (err: any, result: { affectedRows: number | PromiseLike<number>; }) => {
                // Check for error, otherwise return the number of removed entries
                if (err) reject(err);
                else resolve(result.affectedRows);
            }
        )
    })
};

/**
 * Removes a specific template from all of the scenarios.
 * @param templateId the templateId being removed from the database
 * @returns The number of items removed from the database.
 */
function RemoveTemplateFromScenarios(templateId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `DELETE from scenario_templates WHERE template_id=${templateId}`,
            (err: any, result: { affectedRows: number | PromiseLike<number>; }) => {
                // Check for error, otherwise return the number of removed entries
                if (err) reject(err);
                else resolve(result.affectedRows);
            }
        )
    });
}


// --> Templates

/**
 * Retrieves all of the template records from the database.
 * @returns An array of all of the templates currently stored in the database,
 * otherwise an empty undefined array.
 */
function GetTemplates(): Promise<Template[]> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT * FROM templates`,
            (err: any, results: any[]) => {
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
 * @returns The first template object matching the passed id, otherwise undefined
 */
function GetTemplate(id: number): Promise<Template> {
    return new Promise((resolve, reject) => {
        dbConnection.query<RowDataPacket[]>(
            `SELECT * FROM templates WHERE pkey = ${id}`,
            (err: any, results: any[]) => {
                // Check for error, otherwise return requested data
                if (err) reject(err);
                else {
                    let output: Template[] = [];
                    results.forEach((entry) => {
                        let template: Template = ConvertRowEntryToTemplate(entry);
                        output.push(template);
                    });
                    resolve(output[0] as Template);
                }
            }
        )
    });
};

/**
 * Adds a new template to the database.
 * @param template The template object to store in the database
 * @returns The template object as it appears in the database
 */
function AddTemplate(template: Template): Promise<Template> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `INSERT INTO templates (name, version, filepath, description) VALUES('${template.name}', '${template.version}','${template.filepath}', '${template.description}')`,
            (err: any, result: { insertId: number; }) => {
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
};

/**
 * Updates the template record in the database to match the passed template object.
 * @param template the template object to update in the database
 * @returns The updated template object as it appears in the database, otherwise undefined.
 */
function UpdateTemplate(template: Template): Promise<Template> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `UPDATE templates SET name='${template.name}', version='${template.version}', filepath='${template.filepath}', description='${template.description}' WHERE pkey=${template.id}`,
            (err: any, result: any) => {
                // Check for an error, otherwise return the updated template
                if (err) reject(err);
                else {
                    GetTemplate(template.id as number)
                        .then(templat => resolve(templat!))
                        .catch(reject)
                }
            }
        )
    });
};

/**
 * Attempts to remove the specified template from the database.
 * @param templateId The templateId to remove from the database
 * @returns The number of items removed from the database.
 */
function RemoveTemplate(templateId: number): Promise<number> {
    return new Promise((resolve, reject) => {
        dbConnection.query<OkPacket>(
            `DELETE FROM templates WHERE pkey=${templateId}`,
            (err: any, result: { affectedRows: number | PromiseLike<number>; }) => {
                // Check for an error, otherwise return the updated template
                if (err) reject(err);
                else resolve(result.affectedRows);
            }
        )
    });
};

// Export the queries
export { GetScenarios, GetScenario, AddScenario, UpdateScenario, RemoveScenario, CreateScenarioDatabase };
export { AddTemplateToScenario, RemoveTemplateFromScenario, RemoveScenarioTemplates, RemoveTemplateFromScenarios, CreateTemplateTableInDatabase };
export { GetTemplates, GetTemplate, AddTemplate, UpdateTemplate, RemoveTemplate };