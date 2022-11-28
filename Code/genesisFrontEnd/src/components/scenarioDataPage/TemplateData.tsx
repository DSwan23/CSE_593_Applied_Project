import { useState } from "react";
import { Button, ButtonGroup, Spinner } from "react-bootstrap";
import { useAddSpacecraftMutation, useRemoveSpacecraftMutation, useUpdateSpacecraftMutation } from "../../store/slices/SpacecraftDataAPI";
import TemplateDataDisplay from "./TemplateDataDisplay";
import TemplateDataForm from "./TemplateDataForm";

interface TemplateDataProps {
    templateDataName: string;
    dataModel: any;
    scenarioName: string;
    template: any;
}

const TemplateData = (props: TemplateDataProps) => {
    // Local State
    const [currentlySelectedItem, setCurrentlySelectedItem] = useState<any>(undefined);
    const [isFormInEditMode, setIsFormInEditMode] = useState(false);
    const [viewDataForm, setViewDataForm] = useState(false);

    // API Calls
    const [removeItem, { isLoading: isItemRemoving }] = useRemoveSpacecraftMutation();
    const [updateItem, { isLoading: isItemUpdating }] = useUpdateSpacecraftMutation();
    const [addItem, { isLoading: isItemAdding }] = useAddSpacecraftMutation();

    // Functions
    const SelectItem = (item: any) => {
        setCurrentlySelectedItem(item);
    }
    const ViewAddForm = () => {
        setCurrentlySelectedItem(undefined);
        setIsFormInEditMode(false);
        setViewDataForm(true);
    }
    const ViewEditForm = () => {
        if (currentlySelectedItem) {
            setIsFormInEditMode(true);
            setViewDataForm(true);
        }
    }
    const RemoveItem = () => {
        removeItem([props.scenarioName, props.template.filepath, currentlySelectedItem.pkey]);
    }
    const SubmitForm = (data: any) => {
        // Send the data out to the service
        if (isFormInEditMode) {
            let updateData = JSON.parse(data);
            updateData['id'] = currentlySelectedItem.pkey;
            console.log(updateData);
            updateItem([props.scenarioName, props.template.filepath, JSON.stringify(updateData)]);
        }
        else { addItem([props.scenarioName, props.template.filepath, data]); }

        // reset the page
        setCurrentlySelectedItem(undefined);
        setIsFormInEditMode(false);
        setViewDataForm(false);
    }
    const CancelForm = () => {
        // reset the page
        setCurrentlySelectedItem(undefined);
        setIsFormInEditMode(false);
        setViewDataForm(false);
    }

    // Control Elements
    const standardButtonGroup: JSX.Element = <ButtonGroup className="m-2">
        <Button className="m-0" variant="primary" onClick={ViewAddForm}>Add {props.templateDataName}</Button>
        <Button className="m-0" variant="primary" onClick={ViewEditForm}>Edit {props.templateDataName}</Button>
        <Button className="m-0" variant="primary" onClick={RemoveItem}>{isItemRemoving ? <Spinner /> : `Remove ${props.templateDataName}`}</Button>
    </ButtonGroup>;

    // render the component
    return <div style={{ width: '100%' }}>
        <h4>{props.templateDataName}</h4>
        {viewDataForm ? null : standardButtonGroup}
        {
            viewDataForm ? <TemplateDataForm dataModel={props.dataModel} submitFcn={SubmitForm} cancelFcn={CancelForm} data={isFormInEditMode ? currentlySelectedItem : undefined} /> :
                <TemplateDataDisplay templateName={props.template.name} templatePath={props.template.filepath} scenarioName={props.scenarioName} dataModel={props.dataModel} selectFcn={SelectItem} selectedItemId={currentlySelectedItem ? currentlySelectedItem.pkey : 0} />
        }
    </div >
}

export default TemplateData;