import { RowDataPacket } from "mysql2";

export interface Template {
    id?: number;
    name: string;
    version: string;
    filepath: string;
    description: string;
}

function ConvertRowEntryToTemplate(entry: RowDataPacket): Template {
    let template: Template = {
        id: entry.pkey,
        name: entry.name,
        version: entry.version,
        filepath: entry.filepath,
        description: entry.description,
    }
    return template;
}

function ConvertJsonToTemplate(entry: any): Template | undefined {
    if (!entry || !entry.id || !entry.name || !entry.version || !entry.filepath || !entry.description) return undefined;
    let template: Template = {
        id: entry.id,
        name: entry.name,
        version: entry.version,
        filepath: entry.filepath,
        description: entry.description,
    };
    return template;
}

export { ConvertRowEntryToTemplate, ConvertJsonToTemplate }