import React from "react";
import Button from "react-bootstrap/Button";
import ScenarioSelector from "../scenarioSelector/ScenarioSelector";

// ==> Component property definition
interface HomePageProps {

}

// ==> React Component
const HomePage = (props: HomePageProps) => {

    // Render the component
    return <div id="HomePage" style={{ display: "flex", flexFlow: "row nowrap", color: "white", backgroundColor: "#242424" }}>
        <div id="CreateNewScenario" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Create A New Scenario</h4>
            <Button>Create</Button>
            {/* <div style={{ margin: 'auto' }}>
                <CreateScenarioForm />
            </div> */}
        </div>
        <div id="SelectExistingScenario" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Available Scenarios</h4>
            {/* <ScenarioBlock name="test" /> */}
            <ScenarioSelector />
        </div>
    </div>
}

export default HomePage