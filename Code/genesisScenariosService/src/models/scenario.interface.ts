import { RowDataPacket } from "mysql2";
import { Template } from "./template.interface";

export interface Scenario {
    id?: number,
    name: string;
    lastUpdated: Date;
    description: string;
    templateIds: Array<number>;
}

function ConvertRowEntryToScenario(entry: RowDataPacket): Scenario {
    let scenario: Scenario = {
        id: entry.pkey,
        name: entry.name,
        lastUpdated: entry.last_updated,
        description: entry.description,
        templateIds: entry.templates.split(',')
    }
    return scenario;
}

export { ConvertRowEntryToScenario }