import { RowDataPacket } from "mysql2";

export interface Template extends RowDataPacket {
    id?: number;
    name: string;
    version: string;
    filePath: string;
    description: string;
    deprecated: boolean;
}
