import React, { useMemo } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useGetScenarioQuery, useGetTemplateQuery } from "../../store/slices/GenesisScenarioAPI";
import { useGetAllSpacecraftQuery } from "../../store/slices/SpacecraftDataAPI";
import DataModelWrapper from "./DataModelWrapper";
import TemplateDataDisplay from "./TemplateDataDisplay";

// ==> Component property definition
interface ScenarioDataPageProps {
    scenarioId: number;
}

// ==> React Component
const ScenarioDataPage = (props: ScenarioDataPageProps) => {
    // Get the scenario information
    const {
        data: scenario,
        isLoading: isScenarioLoading,
        isSuccess: isScenarioSuccess,
        isError: isScenarioError,
        error: scenarioError
    } = useGetScenarioQuery(props.scenarioId);

    // Create a tab for each template assigned to this scenario
    const templateTabs: JSX.Element[] = [];
    if (isScenarioSuccess) {
        scenario?.templateIds.forEach((templateId: number) => {
            templateTabs.push(
                <Tab eventKey={`TemplateTab${templateId}`} title={`Template ${templateId}`} >
                    <DataModelWrapper templateId={templateId} scenarioName="Test_Schmea" />
                </Tab >
            )
        })
    }
    // Render the component
    // TODO: Use actual scenario name here
    return <div id="ScenarioDataPage" style={{ display: "flex", flexFlow: "row nowrap", color: "white", backgroundColor: "#242424" }}>
        <Tabs variant='dark' style={{ height: '100%' }}>
            {templateTabs}
        </Tabs>
        {/* <DataModelWrapper templateId={1} scenarioName="Test_Schmea" /> */}
    </div>
}

export default ScenarioDataPage