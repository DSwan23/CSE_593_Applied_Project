import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import { useGetScenarioQuery, useGetTemplateQuery } from "../../store/slices/GenesisScenarioAPI";
import { useGetAllSpacecraftQuery } from "../../store/slices/SpacecraftDataAPI";
import ScenarioDataDisplay from "./SceanrioDataDisplay";

// ==> Component property definition
interface ScenarioDataPageProps {
    scenarioName: string;
    templateDataModel: object;
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

    // const scenarioTemplates = useMemo(() => {
    //     // Get the template data for each template id on the scenario
    //     let templates: any[] = [];
    //     scenario.templateIds.forEach(async (id: string) => {
    //         await useGetTemplateQuery((Number.parseInt(id))).unwrap().then((template: any) => templates.push(template));
    //     });
    //     console.log(templates);
    // }, [scenario])

    // Create a datapage for each template

    // const {
    //     data: spacecraft = [],
    //     isLoading: isSpacecraftListLoading,
    //     isSuccess,
    //     isError,
    //     error
    // } = useGetAllSpacecraftQuery(props.scenarioName);

    // Create the list of headers
    // let dataModelHeader: string[] = [];
    // for (let dataModelProp in props.templateDataModel) {
    //     dataModelHeader.push(dataModelProp);
    // }

    // Render the component
    return <div id="ScenarioDataPage" style={{ display: "flex", flexFlow: "row nowrap", color: "white", backgroundColor: "#242424" }}>
        <ScenarioDataDisplay scenarioName="Test_Schema" templateId={1} dataHeaders={["dataModelHeader"]} data={[]} />
    </div>
}

export default ScenarioDataPage