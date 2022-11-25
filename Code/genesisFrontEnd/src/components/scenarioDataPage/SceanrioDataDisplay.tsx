import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useGetTemplateQuery } from "../../store/slices/GenesisScenarioAPI";
import { useGetAllSpacecraftQuery } from "../../store/slices/SpacecraftDataAPI";
import { useGetTemplateDataModelQuery } from "../../store/slices/TemplateDatabaseAPI";

// ==> Component property definition
interface ScenarioDataDisplayProps {
    templateId: number;
    scenarioName: string;
    dataHeaders: string[];
    data: any[];
}

// ==> React Component
const ScenarioDataDisplay = (props: ScenarioDataDisplayProps) => {
    // Data Headers
    const [dataHeaderElements, setDataHeaderElements] = useState<JSX.Element[]>([]);
    const [dataHeaderValues, setDataHeaderValues] = useState<string[]>([]);
    const [loadedDataModel, setLoadedDataModel] = useState(false);
    // Get the template data
    const { data: template, isSuccess: isTemplateLoaded } = useGetTemplateQuery(props.templateId);
    let dataModel: any;
    if (isTemplateLoaded) {
        import(/* @vite-ignore */ "http:\\127.0.0.1:8000\\TemplateDatabase\\" + template?.filepath + "DataModel.js").then(model => {
            dataModel = model;
            let modelInstance = new dataModel.Spacecraft();
            let properties = modelInstance?.DisplayProperties();
            if (properties)
                setDataHeaderValues(properties);
        })
    }

    if (isTemplateLoaded) {
        console.log(`scenario name: ${props.scenarioName}`);
        console.log(`template name: ${template.name}`);
        const { data: templateData, isSuccess: isTemplateDataLoaded } = useGetAllSpacecraftQuery([props.scenarioName, template.name]);
    }

    useEffect(() => {
        let headerElements: JSX.Element[] = [];
        dataHeaderValues.forEach(element => {
            headerElements.push(<th>{element}</th>)
        });
        setDataHeaderElements(headerElements);
    }, [dataHeaderValues]);

    // Data Elements
    let dataElementElements: JSX.Element[] = [];
    // if (dataHeaderValues.length > 0) {
    //     props.data.forEach(element => {
    //         let dataColumns: JSX.Element[] = [];
    //         for (let field of dataHeaderValues) {
    //             dataColumns.push(<td>{element[field]}</td>)
    //         }
    //         dataElementElements.push(<tr>{dataColumns}</tr>)
    //     });
    // }

    // Render the component
    return <Suspense fallback={<div>Loading ...</div>}>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    {dataHeaderElements}
                </tr>
            </thead>
            <tbody>
                {dataElementElements}
            </tbody>
        </Table>
    </Suspense>
}

export default ScenarioDataDisplay