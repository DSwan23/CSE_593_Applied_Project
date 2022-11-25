export class Spacecraft {
    // Properties
    dataTemplateVersion?: string = "v1";
    id?: number;
    name: string;
    constellation: string;
    position: number[];
    velocity: number[];

    // Constructors
    constructor(data?: any) {
        this.id = data?.id ?? data?.pkey ?? -1;
        this.name = data?.name ?? '';
        this.constellation = data?.constellation ?? '';
        this.position = [];
        this.position[0] = data?.rx ?? 0;
        this.position[1] = data?.ry ?? 0;
        this.position[2] = data?.rz ?? 0;
        this.velocity = [];
        this.velocity[0] = data?.vx ?? 0;
        this.velocity[1] = data?.vy ?? 0;
        this.velocity[2] = data?.vz ?? 0;
    }

    // Data validation
    validateSpacecraft = () => {
        // Check for undefined properties (non-optional properties)
        return !(!this.name || !this.constellation ||
            this.position.length !== 3 || this.velocity.length !== 3)
    };

    // Update parameters
    public updateParameters(data: any) {
        this.id = data.id ?? data.pkey ?? undefined;
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

    // Display Properties
    public DisplayProperties(): string[] {
        return ["name", "constellation", "position", "velocity"];
    }

    // Crud Operations
    public addQuery() {
        return `INSERT INTO spacecraft (name, constellation, rx, ry, rz, vx, vy, vz) VALUES ('${this.name}','${this.constellation}',${this.position[0]},${this.position[1]},${this.position[2]},${this.velocity[0]},${this.velocity[1]},${this.velocity[2]})`;
    };

    public selectAllQuery() {
        return `SELECT * from spacecraft`;
    };

    public selectOneQuery(id?: number) {
        return `SELECT * from spacecraft WHERE pkey = ${id ? id : this.id ? this.id : -1}`;
    }

    public updateQuery(id?: number) {
        return `UPDATE spacecraft SET name='${this.name}', constellation='${this.constellation}', rx='${this.position[0]}', rx='${this.position[0]}', ry='${this.position[1]}', rz='${this.position[2]}', vx='${this.velocity[0]}', vy='${this.velocity[1]}', vz='${this.velocity[2]}' WHERE pkey=${id ? id : this.id ? this.id : -1}`;
    }

    public removeQuery(id?: number) {
        return `DELETE FROM scenarios WHERE pkey=${id ? id : this.id ? this.id : -1}`;
    }

    // Error messages

}
