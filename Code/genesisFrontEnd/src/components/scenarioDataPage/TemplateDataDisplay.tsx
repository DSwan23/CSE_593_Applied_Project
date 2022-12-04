import { Spinner, Table } from "react-bootstrap";
import { useGetAllSpacecraftQuery } from "../../store/slices/SpacecraftDataAPI";

// ==> Component property definition
interface TemplateDataDisplayProps {
    templateName: string;
    templatePath: string;
    scenarioName: string;
    dataModel: any;
    selectFcn: Function;
    selectedItemId: number;
}

// ==> React Component
const TemplateDataDisplay = (props: TemplateDataDisplayProps) => {
    // Local variables
    let dataInstance: any = new props.dataModel.Spacecraft();
    let headerValues: string[] = dataInstance.DisplayProperties();
    let dataElementElements: JSX.Element[] = [];
    let dataHeaderElements: JSX.Element[] = [];

    const { data: templateData, isSuccess: isTemplateDataLoaded } = useGetAllSpacecraftQuery([props.scenarioName, props.templatePath]);
    // Data Headers
    if (headerValues) {
        headerValues.forEach((element: string) => {
            dataHeaderElements.push(<th>{element}</th>)
        });
    }

    const SelectItem = (event: any) => {
        let selectedItem = templateData.find((entry: any) => entry.pkey == event.target.id);
        props.selectFcn(selectedItem);
    }

    // Data Elements
    if (isTemplateDataLoaded && headerValues.length > 0 && templateData && templateData.length > 0) {
        templateData?.forEach((element: any) => {
            let dataColumns: JSX.Element[] = [];
            let modelObject = new props.dataModel.Spacecraft(element);
            for (let field of headerValues) {
                let fieldData = modelObject[field];
                // Check for an array datatype
                if (Array.isArray(fieldData)) {
                    fieldData = '[' + fieldData.join(', ') + ']';
                }
                // Create the table element
                dataColumns.push(<td id={modelObject['id']} style={modelObject['id'] == props.selectedItemId ? { color: 'violet' } : {}}>{fieldData}</td>)
            }
            dataElementElements.push(<tr onClick={SelectItem} >{dataColumns}</tr>)
        });
    }

    // Render the component
    return isTemplateDataLoaded ? <Table striped bordered hover variant="dark">
        <thead>
            <tr>
                {dataHeaderElements}
            </tr>
        </thead>
        <tbody>
            {dataElementElements}
        </tbody>
    </Table> : <Spinner />


}

export default TemplateDataDisplay