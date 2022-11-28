import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useGetTemplateQuery } from "../../store/slices/GenesisScenarioAPI";
import TemplateData from "./TemplateData";
import TemplateDataDisplay from "./TemplateDataDisplay";
import TemplateDataForm from "./TemplateDataForm";

interface DataModelWrapperProps {
    templateId: number;
    scenarioName: string;
}

const DataModelWrapper = (props: DataModelWrapperProps) => {
    // Get the template data
    const [dataModel, setDataModel] = useState<any>(undefined);
    const { data: template, isSuccess: isTemplateLoaded } = useGetTemplateQuery(props.templateId);
    // Load the data model from the template file storage location
    useMemo(() => {
        const loadData = async () => {
            let result = await import(/* @vite-ignore */ "http:\\127.0.0.1:8000\\TemplateDatabase\\" + template?.filepath + "DataModel.js");
            setDataModel(result);
        }
        if (isTemplateLoaded)
            loadData();
    }, [template])

    // return isTemplateLoaded && dataModel ? <div style={{ width: '100%' }}> <TemplateDataDisplay templateName={template?.name} templatePath={template?.filepath} scenarioName={props.scenarioName} dataModel={dataModel} /> <TemplateDataForm dataModel={dataModel} /> </div> : <Spinner />
    return isTemplateLoaded && dataModel ? <TemplateData templateDataName="Spacecraft" dataModel={dataModel} scenarioName={props.scenarioName} template={template} /> : <Spinner />
}

export default DataModelWrapper;