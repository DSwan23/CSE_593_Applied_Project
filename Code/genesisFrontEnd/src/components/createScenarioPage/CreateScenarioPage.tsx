import { SyntheticEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import AvailableTemplates from "../availableTemplates/AvailableTemplates";
import { FloatingLabel, Form } from "react-bootstrap";
import { useAddNewScenarioMutation, useAddTemplateToScenarioMutation } from "../../store/slices/GenesisScenarioAPI";

// ==> Component property definition
interface CreateScenarioPageProps {

}

// ==> React Component
const CreateScenarioPage = (props: CreateScenarioPageProps) => {

    // Local state
    const [linkedTemplates, setLinkedTemplates] = useState<number[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [addScenario, { isLoading: isAddingScenario }] = useAddNewScenarioMutation();
    const [linkTemplateToScenario] = useAddTemplateToScenarioMutation();

    // Function to track currently selected template

    const LinkTemplate = (templateId: number, method: string) => {
        let foundTemplate = linkedTemplates.find(element => element == templateId);
        if (method == "add" && !foundTemplate) {
            console.log('Linked Template id');
            console.log(templateId);
            setLinkedTemplates(currentArray => [...currentArray, templateId]);
        } else if (method == "remove" && foundTemplate) {
            console.log('Remove Template id');
            console.log(templateId);
            setLinkedTemplates(currentArray => currentArray.filter(entry => entry != templateId))
        }
    }

    const SubmitForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
        // Create new Scenario Object
        if ([name, description].every(Boolean) && !isAddingScenario) {
            let newScenario = { name: name, description: description };
            // Submit the new scenario
            let newScenarioId: number;
            await addScenario(newScenario).unwrap().then(async (result) => {
                console.log("Result");
                console.log(result);
                newScenarioId = result.id
                // Link the selected templates to this scenario
                let linkTemplatesPromises: Promise<any>[] = [];
                linkedTemplates.forEach((templateId) => linkTemplatesPromises.push(linkTemplateToScenario([newScenarioId, templateId])));
                await Promise.allSettled(linkTemplatesPromises);
            });
        }
    }

    // Render the component
    return <div id="CreateScenarioPage" style={{ display: "flex", flexFlow: "row nowrap", color: "white", backgroundColor: "#242424" }}>
        <div id="NewScenarioForm" style={{ flex: 1, textAlign: 'center', margin: '10px' }}>
            <h4>Scenario Details</h4>
            <Form onSubmit={SubmitForm} style={{ marginLeft: '100px', marginRight: '100px', marginTop: '10px' }}>
                <FloatingLabel label="Scenario Name" style={{ color: 'black' }}>
                    <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={name} placeholder='holder' onChange={(event) => setName(event.target.value)} />
                </FloatingLabel>
                <FloatingLabel label="Scenario Description" style={{ color: 'black', height: '100px', marginTop: '10px' }}>
                    <Form.Control style={{ backgroundColor: '#d3d3d4', height: '100%' }} as="textarea" value={description} placeholder='holder' onChange={(event) => setDescription(event.target.value)} />
                </FloatingLabel>
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form>
        </div>
        <div id="TemplateSection" style={{ flex: 1, textAlign: 'center', margin: '10px' }}>
            <AvailableTemplates linkedTemplateIds={linkedTemplates} linkTemplateFcn={LinkTemplate} />
        </div>
    </div>
}

export default CreateScenarioPage