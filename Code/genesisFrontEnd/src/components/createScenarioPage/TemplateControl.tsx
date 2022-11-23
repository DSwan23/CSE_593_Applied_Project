import React from "react";
import AvailableTemplates from "../availableTemplates/AvailableTemplates";
import CreateScenarioForm from "./CreateScenarioForm";

// ==> Component property definition
interface TemplateSelectionProps {

}

// ==> React Component
const TemplateControl = (props: TemplateSelectionProps) => {

    // Render the component
    return <div id="TemplateControl" style={{ display: "inline-grid", gridTemplateColumns: "1fr 20px 1fr", gridTemplateAreas: "left center right", color: "white", backgroundColor: "#242424" }}>
        <AvailableTemplates />
    </div>
}

export default TemplateControl