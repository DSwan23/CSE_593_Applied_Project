import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Accordion, ButtonGroup, ButtonToolbar, FloatingLabel, Form, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { useAddNewTemplateMutation, useGetAllTemplatesQuery, useRemoveTemplateMutation, useUpdateTemplateMutation } from "../../store/slices/GenesisScenarioAPI";


// ==> Component property definition
interface AvailableTemplatesProps {
    linkedTemplateIds: number[];
    linkTemplateFcn: (templateId: number, method: string) => void;
}

// ==> React Component
const AvailableTemplates = (props: AvailableTemplatesProps) => {
    // Local State
    const [selectedTemplateId, setSelectedTemplateId] = useState(-1);
    const [selectedTemplateIsLinked, setSelectedTemplateIsLinked] = useState(false);
    const [viewTemplateForm, setViewTemplateForm] = useState(false);
    const [formInEditMode, setFormInEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [version, setVerison] = useState("");
    const [filepath, setFilepath] = useState("");
    // API Calls
    const [addNewTemplate, { isLoading: isSubmittingNewTemplate }] = useAddNewTemplateMutation();
    const [updateTemplate, { isLoading: isSubmittingUpdatedTemplate }] = useUpdateTemplateMutation();
    const [removeTemplate, { isLoading: isRemovingTemplate }] = useRemoveTemplateMutation();
    const {
        data: templates = [],
        isLoading: isTemplateListLoading,
        isSuccess,
        isError,
        error
    } = useGetAllTemplatesQuery("");

    // Create the accordian elements for the templates
    let noTemplatesFound: JSX.Element = <Accordion.Item eventKey="0">
        <Accordion.Header>No Templates Created Yet</Accordion.Header>
        <Accordion.Body>
            There are no scenario templates, yet. Go ahead and create one!
        </Accordion.Body>
    </Accordion.Item>
    let templateItems: JSX.Element[] = [];
    if (isSuccess) {
        templates?.forEach((template: any) => templateItems.push(<Accordion.Item eventKey={template.id} key={template.id}>
            <Accordion.Header>{props.linkedTemplateIds.find(elem => elem == template.id) ? <FontAwesomeIcon icon={faLink} /> : ""}{template.name}</Accordion.Header>
            <Accordion.Body>
                Version : {template.version}<br />{template.description}
            </Accordion.Body>
        </Accordion.Item>));
    }
    else if (isError) {
        console.log('template error');
        console.log(error);
    }

    // Functions
    const SelectTab = (eventKey: AccordionEventKey, event: object) => {
        // Convert the id to number
        let templateId = eventKey ? Number.parseInt(eventKey as string) : -1;
        // Store the selected template id
        setSelectedTemplateId(templateId);
        // Determine if the selected template is linked or not
        setSelectedTemplateIsLinked(props.linkedTemplateIds.find(elem => elem == templateId) ? true : false);
    }

    const LinkTab = () => {
        if (selectedTemplateId != -1) {
            if (selectedTemplateIsLinked) {
                props.linkTemplateFcn(selectedTemplateId, "remove");
                setSelectedTemplateIsLinked(false);
            }
            else {
                props.linkTemplateFcn(selectedTemplateId, "add");
                setSelectedTemplateIsLinked(true);
            }
        }
    }

    const ViewNewTemplateForm = () => {
        setSelectedTemplateId(-1);
        initializeFormData(undefined);
        setFormInEditMode(false);
        setViewTemplateForm(true);
    }

    const initializeFormData = (templateData?: any) => {
        setName(templateData?.name ?? "");
        setDescription(templateData?.description ?? "");
        setFilepath(templateData?.filepath ?? "");
        setVerison(templateData?.version ?? "");
    }

    const ViewEditTemplateForm = () => {
        let selectedTemplate = templates.find((temp: any) => temp.id == selectedTemplateId);
        initializeFormData(selectedTemplate);
        setFormInEditMode(true);
        setViewTemplateForm(true);
    }

    const CancelTemplateForm = () => {
        setViewTemplateForm(false);
    }

    const SubmitForm = async () => {
        // Check to see if we can save, filled out and not currently submitting
        if ([name, version, description, filepath].every(Boolean) && (!isSubmittingNewTemplate && !isSubmittingUpdatedTemplate)) {
            // Create the object to submit
            let template = { id: selectedTemplateId, name: name, version: version, description: description, filepath: filepath };
            // Submit the object
            try {
                if (!formInEditMode) {
                    await addNewTemplate(template);
                } else {
                    await updateTemplate(template);
                }
                // Reset the local data
                setSelectedTemplateId(-1);
                initializeFormData(undefined);
                setViewTemplateForm(false);
            } catch (error) { console.log("Failed to submit template: ", error); }
        }
    }

    const RemoveTemplate = async () => {
        if (selectedTemplateId != -1 && !isRemovingTemplate)
            // Remove the currently selected template
            await removeTemplate(selectedTemplateId);
    }

    // Sub components
    const standardButtonGroup: JSX.Element = <ButtonGroup className="m-2">
        <Button className="m-0" variant="primary" onClick={LinkTab}>{selectedTemplateIsLinked ? "Unlink Template" : "Link Template"}</Button>
        <Button className="m-0" variant="primary" onClick={ViewNewTemplateForm}>New Template</Button>
        <Button className="m-0" variant="primary" onClick={ViewEditTemplateForm}>Edit Template</Button>
        <Button className="m-0" variant="primary" onClick={RemoveTemplate}>{isRemovingTemplate ? <Spinner /> : "Remove Template"}</Button>
    </ButtonGroup>;

    const templateFormButtonGroup: JSX.Element = <ButtonGroup className="m-2">
        <Button className="m-0" variant="primary" onClick={SubmitForm}>{isSubmittingNewTemplate || isSubmittingUpdatedTemplate ? <Spinner /> : "Submit"}</Button>
        <Button className="m-0" variant="primary" onClick={CancelTemplateForm}>Cancel</Button>
    </ButtonGroup>;

    const TemplateForm: JSX.Element = <Form onSubmit={SubmitForm} style={{ marginLeft: '100px', marginRight: '100px', marginTop: '10px' }}>
        <FloatingLabel label="Template Name" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={name} placeholder='holder' onChange={(event) => setName(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Template Verison" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={version} placeholder='holder' onChange={(event) => setVerison(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Filepath to Template" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={filepath} placeholder='holder' onChange={(event) => setFilepath(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Template Description" style={{ color: 'black', height: '100px', marginTop: '10px' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4', height: '100%' }} as="textarea" value={description} placeholder='holder' onChange={(event) => setDescription(event.target.value)} />
        </FloatingLabel>
    </Form>;

    const ViewAvailableTemplates: JSX.Element = <Accordion className="m-2" onSelect={SelectTab}>
        {templateItems.length > 0 ? templateItems : noTemplatesFound}
    </Accordion>;

    // Render the component
    return <div>
        <h4>Available Templates</h4>
        {viewTemplateForm ? templateFormButtonGroup : standardButtonGroup}
        {isTemplateListLoading ? <Spinner /> : null}
        {isError ? <div>Error Loading Templates</div> : null}
        {
            !isTemplateListLoading && !isError ?
                viewTemplateForm ? TemplateForm :
                    ViewAvailableTemplates : null
        }
    </div >

}

export default AvailableTemplates