import { RowDataPacket } from "mysql2";

export class Spacecraft {
    // Properties
    version?: string = "v2";
    id?: number;
    name: string;
    constellation: string;
    position: number[];
    velocity: number[];

    // Constructors
    constructor(data: any | RowDataPacket) {
        this.id = data.pkey ?? undefined;
        this.name = data.name;
        this.constellation = data.constellation;
        this.position = [];
        this.position[0] = data.rx;
        this.position[1] = data.ry;
        this.position[2] = data.rz;
        this.velocity = [];
        this.velocity[0] = data.vx;
        this.velocity[1] = data.vy;
        this.velocity[2] = data.vz;
    }

    // Data validation
    validateSpacecraft = () => {
        // Check for undefined properties (non-optional properties)
        // console.log('Spacecraft Validation');
        // console.log(`Name :${!!this.name}`);
        // console.log(`Constellation :${!!this.constellation}`);
        // console.log(`Position :${this.position.length === 3}`);
        // console.log(`Velocity x :${this.position.length === 3}`);
        return !(!this.name || !this.constellation ||
            this.position.length !== 3 || this.velocity.length !== 3)
    };

    // Crud Operations
    AddQuery = () => {
        return `INSERT INTO spacecraft (name, constellation, rx, ry, rz, vx, vy, vz) VALUES (${this.name},${this.constellation},${this.position[0]},${this.position[1]},${this.position[2]},${this.velocity[0]},${this.velocity[1]},${this.velocity[2]})`;
    };

    selectAllQuery = () => {
        return `SELECT * from spacecraft`;
    };

    selectOneQuery = () => {
        return this.id ? `SELECT * from spacecraft WHERE pkey = ${this.id}` : undefined;
    }

    updateQuery = () => {
        return this.id ? `UPDATE spacecraft SET name='${this.name}', constellation='${this.constellation}', rx='${this.position[0]}', rx='${this.position[0]}', ry='${this.position[1]}', rz='${this.position[2]}', vx='${this.velocity[0]}', vy='${this.velocity[1]}', vz='${this.velocity[2]}' WHERE pkey=${this.id}` : undefined;
    }

    removeQuery = () => {
        return this.id ? `DELETE FROM scenarios WHERE pkey=${this.id}` : undefined;
    }
}
