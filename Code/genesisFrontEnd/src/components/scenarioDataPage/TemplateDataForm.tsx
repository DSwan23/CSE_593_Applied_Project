import React, { useEffect, useMemo, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "react-bootstrap";

interface TemplateDataFormProps {
    dataModel: any;
    data?: any;
    submitFcn: Function;
    cancelFcn: Function;
}

const TemplateDataForm = (props: TemplateDataFormProps) => {

    // ==> Trying formik
    // Create the data model
    let dataModelInstance = new props.dataModel.Spacecraft();

    // Setup initial values
    // Object to return
    let initalData: any = {};
    // create an object entry for each field in data model
    dataModelInstance.FormFields().forEach((field: any) => initalData[field.field] = props.data ? props.data[field.field] : dataModelInstance[field.field]);

    // Create the validation schema
    let validationObj: any = Yup.object();
    dataModelInstance.FormFields().forEach((field: any) => {
        // Assign the validation based on the type in the model
        let validationType: any;
        switch (field.type) {
            case String:
                validationType = Yup.string().required('Required');
                break;
            case Number:
                validationType = Yup.number().required('Required');
                break;
            default:
                validationType = Yup.string().required('Required');
                break;
        }
        validationObj[field.field] = validationType;
    });

    // Create the formik object
    const formik = useFormik({ initialValues: initalData, validationSchema: validationObj, onSubmit: (values: any) => { let obj = JSON.stringify(values); props.submitFcn(obj); } });
    // Create the form elements
    let formElements: JSX.Element[] = [];
    dataModelInstance.FormFields().forEach((field: any) => {
        formElements.push(<FloatingLabel label={field.label} style={{ color: 'black', margin: '10px' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }}
                name={field.field}
                id={field.field}
                title={field.altText}
                type="text"
                value={formik.values[field.field]}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors[field.field]} />
            <Form.Control.Feedback type="invalid" style={{ color: 'white' }}>{formik.errors[field.field]?.toString()}</Form.Control.Feedback>
        </FloatingLabel>);
    });

    // Return the completed component
    return <Form onSubmit={formik.handleSubmit}>{formElements}<Button type="submit">Submit</Button><Button onClick={() => props.cancelFcn()}> Cancel</Button></Form >
}

export default TemplateDataForm;