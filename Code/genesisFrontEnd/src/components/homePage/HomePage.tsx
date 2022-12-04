import React from "react";
import Button from "react-bootstrap/Button";
import ScenarioSelector from "../scenarioSelector/ScenarioSelector";

// ==> Component property definition
interface HomePageProps {
    openCreateScenarioTabFcn: Function;
    openScenarioTabFcn: Function;
}

// ==> React Component
const HomePage = (props: HomePageProps) => {

    // Render the component
    return <div id="HomePage" style={{ display: "flex", flexFlow: "row nowrap", color: "white", backgroundColor: "#242424" }}>
        <div id="CreateNewScenario" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Create A New Scenario</h4>
            <Button onClick={() => props.openCreateScenarioTabFcn()}>Create</Button>
        </div>
        <div id="SelectExistingScenario" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Available Scenarios</h4>
            <ScenarioSelector openScenarioFcn={props.openScenarioTabFcn} />
        </div>
    </div>
}

export default HomePage