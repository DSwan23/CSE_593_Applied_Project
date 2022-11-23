import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Nav } from "react-bootstrap";

// ==> Component property definition
interface PageHeaderProps {

}

// ==> React Component
const PageHeader = (props: PageHeaderProps) => {

    // Render the component
    return <Navbar sticky="top" bg="primary" variant="dark" >
        <Container>
            <Navbar.Brand>Genesis Scenario Management</Navbar.Brand>
            <Nav className="me-auto"></Nav>
        </Container>
    </Navbar>
}

export default PageHeader