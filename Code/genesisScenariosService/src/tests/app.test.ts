import { describe, test, expect } from '@jest/globals';
import request from "supertest";
import app from "../app";
import * as databaseQueries from '../database/mysqlDatabase';
import { Scenario } from '../models/scenario.interface';
import { Template } from '../models/template.interface';

// Dummy Scenario Objects
const scenario1: Scenario = { id: 1, name: "Scenario 1", description: "Sceanrio 1 description here", lastUpdated: "2022-11-26 02:27:33", templateIds: [1, 2] };
const scenario2: Scenario = { id: 2, name: "Scenario 2", description: "Sceanrio 2 description here", lastUpdated: "2022-11-24 02:27:33", templateIds: [1] };
const scenarioToAdd: Scenario = { name: "Scenario Add", description: "Sceanrio Add description here", lastUpdated: "", templateIds: [] };

// Dummy Template Objects
// const template1: Template = {};
// const template2: Template = {};
// const templateToAdd: Template = {};

// Mock the MySQl Database calls
jest.spyOn(databaseQueries, 'GetScenarios').mockResolvedValue([scenario1, scenario2]);
jest.spyOn(databaseQueries, 'GetScenario').mockImplementation(async (id: number) => { if (id == 1) return scenario1; else return scenario2; })
jest.spyOn(databaseQueries, 'AddScenario').mockImplementation(async (scenario: Scenario) => { scenario['id'] = 3; return scenario; });


// jest.spyOn(databaseQueries, 'GetTemplates').mockResolvedValue([template1, template2]);

// Testing Crud Actions
describe("Testing the Create Routes", () => {
    test("Add New Scenario", () => {
        return request(app).post("/scenarios/add")
            .send(scenarioToAdd)
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((response) => {
                console.log(response.body);
                response.body.length = 1;
                response.body.name = "Scenario To Add";
                response.body.id = 3;
            });
    });
});

describe("Testing the Read Routes", () => {
    // test("Root API Path, HTML API Docs", () => {
    //     return request(app).get("/").expect("Content-Type", "text/html; charset=utf-8").expect(200);
    // })
    // test("Root API Path, JSON API Docs", () => {
    //     return request(app).get("/").set({ "Content-Type": "application/json" }).expect("Content-Type", /json/).expect(200);
    // })
    test("Get All Scenarios", () => {
        return request(app).get("/scenarios")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((response) => {
                response.body.length = 2;
                response.body[0].name = "Scenario 1";
                response.body[1].name = "Scenario 2";
            });
    });
    test("Get Single Scenario", () => {
        return request(app).get("/scenarios/1")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((response) => {
                response.body.length = 1;
                response.body.name = "Scenario 1";
            });
    });
    test("Get All Templates", () => {
        return request(app).get("/templates")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((response) => {
                response.body.length = 2;
                response.body[0].name = "Template 1";
                response.body[1].name = "Template 2";
            });
    });
    test("Get Single Template", () => {
        return request(app).get("/templates/1")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((response) => {
                response.body.length = 1;
                response.body.name = "Template 1";
            });
    });
});



describe("Testing the Update Routes", () => {

});
