import React from "react";
import { Spinner } from "react-bootstrap";
import { useGetAllScenariosQuery } from "../../store/slices/GenesisScenarioAPI";

// ==> Component property definition
interface ScenarioBlockProps {
    name: string;
}

// ==> React Component
const ScenarioBlock = (props: ScenarioBlockProps) => {

    // Get the list of scenarios from the API
    const {
        data: scenarios,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllScenariosQuery();

    // generate componets for each returned value
    let scenariosElements;
    if (isLoading) {
        scenariosElements = <Spinner />;
    } else if (isSuccess) {
        console.log(scenarios);
        scenariosElements = scenarios.map(scenario => <h6>{scenario.id} : {scenario.name}</h6>);
        console.log(scenariosElements);
    }
    else if (isError) {
        scenariosElements = <div>Error: {error.toString()}</div>;
    }

    // Render the component
    return <section><h6>Database Scenarios</h6>{scenariosElements}</section>
}

export default ScenarioBlock