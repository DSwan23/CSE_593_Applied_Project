import { RowDataPacket } from "mysql2";

export interface Template {
    id?: number;
    name: string;
    version: string;
    filepath: string;
    description: string;
}

/**
 * Converts a mysql entry into a template object.
 * @param entry The datapacket retrieved from a MySQL query
 * @returns The template object representation of the provided data packet.
 */
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

/**
 * Converts a JSON object into a template object.
 * @param entry The JSON object to convert
 * @returns The template object representation of the passed JSON object.
 */
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

// Export the functions so they may be used
export { ConvertRowEntryToTemplate, ConvertJsonToTemplate }