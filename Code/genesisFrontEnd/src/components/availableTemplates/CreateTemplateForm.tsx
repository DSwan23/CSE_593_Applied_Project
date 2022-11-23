import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

// ==> Component property definition
interface CreateTemplateFormProps {

}

// ==> React Component
const CreateTemplateForm = (props: CreateTemplateFormProps) => {
    // Local State
    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [filePath, setFilePath] = useState("");
    const [description, setDescription] = useState("");

    // Render the component
    return <Form onSubmit={(event) => { event.preventDefault(); }} style={{ marginLeft: '100px', marginRight: '100px', marginTop: '10px' }}>
        <FloatingLabel label="Name" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={name} placeholder='holder' onChange={(event) => setName(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Version" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={name} placeholder='holder' onChange={(event) => setName(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Filepath" style={{ color: 'black' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} type="text" value={name} placeholder='holder' onChange={(event) => setName(event.target.value)} />
        </FloatingLabel>
        <FloatingLabel label="Description" style={{ color: 'black', height: '100px', marginTop: '10px' }}>
            <Form.Control style={{ backgroundColor: '#d3d3d4' }} as="textarea" value={description} placeholder='holder' onChange={(event) => setDescription(event.target.value)} />
        </FloatingLabel>
        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
            Submit
        </Button>
    </Form>
}

export default CreateTemplateForm