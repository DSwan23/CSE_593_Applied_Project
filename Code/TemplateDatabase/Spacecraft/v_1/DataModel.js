"use strict";
export const __esModule = true;
// const _Spacecraft = void 0;
// export { _Spacecraft as Spacecraft };
var Spacecraft = /** @class */ (function () {
    // Constructors
    function Spacecraft(data) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        // Properties
        this.dataTemplateVersion = "v1";
        // Data validation
        this.validateSpacecraft = function () {
            // Check for undefined properties (non-optional properties)
            return !(!_this.name || !_this.constellation ||
                _this.position.length !== 3 || _this.velocity.length !== 3);
        };
        this.id = (_b = (_a = data === null || data === void 0 ? void 0 : data.id) !== null && _a !== void 0 ? _a : data === null || data === void 0 ? void 0 : data.pkey) !== null && _b !== void 0 ? _b : -1;
        this.name = (_c = data === null || data === void 0 ? void 0 : data.name) !== null && _c !== void 0 ? _c : '';
        this.constellation = (_d = data === null || data === void 0 ? void 0 : data.constellation) !== null && _d !== void 0 ? _d : '';
        this.position = [];
        this.position[0] = (_e = data === null || data === void 0 ? void 0 : data.rx) !== null && _e !== void 0 ? _e : 0;
        this.position[1] = (_f = data === null || data === void 0 ? void 0 : data.ry) !== null && _f !== void 0 ? _f : 0;
        this.position[2] = (_g = data === null || data === void 0 ? void 0 : data.rz) !== null && _g !== void 0 ? _g : 0;
        this.velocity = [];
        this.velocity[0] = (_h = data === null || data === void 0 ? void 0 : data.vx) !== null && _h !== void 0 ? _h : 0;
        this.velocity[1] = (_j = data === null || data === void 0 ? void 0 : data.vy) !== null && _j !== void 0 ? _j : 0;
        this.velocity[2] = (_k = data === null || data === void 0 ? void 0 : data.vz) !== null && _k !== void 0 ? _k : 0;
    }
    // Update parameters
    Spacecraft.prototype.updateParameters = function (data) {
        var _a, _b;
        this.id = (_b = (_a = data.id) !== null && _a !== void 0 ? _a : data.pkey) !== null && _b !== void 0 ? _b : undefined;
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
    };
    // Display Properties
    Spacecraft.prototype.DisplayProperties = function () {
        return ["name", "constellation", "position", "velocity"];
    };
    // Crud Operations
    Spacecraft.prototype.addQuery = function () {
        return "INSERT INTO spacecraft (name, constellation, rx, ry, rz, vx, vy, vz) VALUES ('".concat(this.name, "','").concat(this.constellation, "',").concat(this.position[0], ",").concat(this.position[1], ",").concat(this.position[2], ",").concat(this.velocity[0], ",").concat(this.velocity[1], ",").concat(this.velocity[2], ")");
    };
    ;
    Spacecraft.prototype.selectAllQuery = function () {
        return "SELECT * from spacecraft";
    };
    ;
    Spacecraft.prototype.selectOneQuery = function (id) {
        return "SELECT * from spacecraft WHERE pkey = ".concat(id ? id : this.id ? this.id : -1);
    };
    Spacecraft.prototype.updateQuery = function (id) {
        return "UPDATE spacecraft SET name='".concat(this.name, "', constellation='").concat(this.constellation, "', rx='").concat(this.position[0], "', rx='").concat(this.position[0], "', ry='").concat(this.position[1], "', rz='").concat(this.position[2], "', vx='").concat(this.velocity[0], "', vy='").concat(this.velocity[1], "', vz='").concat(this.velocity[2], "' WHERE pkey=").concat(id ? id : this.id ? this.id : -1);
    };
    Spacecraft.prototype.removeQuery = function (id) {
        return "DELETE FROM scenarios WHERE pkey=".concat(id ? id : this.id ? this.id : -1);
    };
    return Spacecraft;
}());
const _Spacecraft = Spacecraft;
export { _Spacecraft as Spacecraft };
