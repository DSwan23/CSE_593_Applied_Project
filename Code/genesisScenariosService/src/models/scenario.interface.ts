import { RowDataPacket } from "mysql2";

export interface Scenario {
    id?: number;
    name: string;
    lastUpdated: string;
    description: string;
    templateIds: Array<number>;
}

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

export { ConvertRowEntryToScenario, ConvertJsonToScenario }