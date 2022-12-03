import { RowDataPacket } from "mysql2";

export interface Scenario {
    id?: number;
    name: string;
    lastUpdated: string;
    description: string;
    templateIds: Array<number>;
}

/**
 * Converts a mysql entry into a scenario object.
 * @param entry The datapacket retrieved from a MySQL query
 * @returns The scenario object representation of the provided data packet.
 */
function ConvertRowEntryToScenario(entry: RowDataPacket): Scenario {
    let scenario: Scenario = {
        id: entry.pkey,
        name: entry.name,
        lastUpdated: entry.last_updated,
        description: entry.description,
        templateIds: entry.templates ? entry.templates.split(',') : []
    }
    return scenario;
}

/**
 * Converts a JSON object into a scenario object.
 * @param entry The JSON object to convert
 * @returns The scenario object representation of the passed JSON object.
 */
function ConvertJsonToScenario(entry: any): Scenario | undefined {
    if (!entry || !entry.id || !entry.name || !entry.lastUpdated || !entry.description || !entry.templateIds) return undefined;
    let scenario: Scenario = {
        id: entry.id,
        name: entry.name,
        lastUpdated: entry.last_updated,
        description: entry.description,
        templateIds: entry.templateIds
    };
    return scenario;
}

// Export the functions so they may be used
export { ConvertRowEntryToScenario, ConvertJsonToScenario }