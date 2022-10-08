import { RowDataPacket } from "mysql2";

export interface Template {
    id?: number;
    name: string;
    version: string;
    filePath: string;
    description: string;
    deprecated: boolean;
}

function ConvertRowEntryToTemplate(entry: RowDataPacket): Template {
    let template: Template = {
        id: entry.pkey,
        name: entry.name,
        version: entry.version,
        filePath: entry.filepath,
        description: entry.description,
        deprecated: entry.deprecated[0] === 1
    }
    return template;
}

export { ConvertRowEntryToTemplate }