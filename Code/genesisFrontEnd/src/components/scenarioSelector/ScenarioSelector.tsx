import React, { ReactComponentElement, useMemo } from "react";
import { Button, Col, ListGroup, ListGroupItem, Row, Spinner, Tab, TabContainer } from "react-bootstrap";
import { useGetAllScenariosQuery } from "../../store/slices/GenesisScenarioAPI";

// ==> Component property definition
interface ScenarioSelectorProps {
    openScenarioFcn: Function;
}

// ==> React Component
const ScenarioSelector = (props: ScenarioSelectorProps) => {
    // Get the list of scenarios from the API
    const {
        data: scenarios = [],
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllScenariosQuery("");

    // Local variables
    let selectedScenarioId: number = -1;
    let selectedScenarioName: string = "";

    // Sort the scenarios
    const sortedScenarios = useMemo(() => {
        if (!scenarios) return
        // Make a shallow copy of the original data
        const sorted: any[] = scenarios.slice();
        // Sort based on most up to date
        sorted.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
        return sorted;
    }, [scenarios]);

    // Click functions
    const selectScenario = (scenarioId: number, scenarioName: string) => {
        selectedScenarioId = scenarioId;
        selectedScenarioName = scenarioName;
    }
    const openScenario = () => {
        if (selectedScenarioId != -1) {
            props.openScenarioFcn(selectedScenarioId, selectedScenarioName);
        }
    }

    // Generate componets for each returned value
    let noScenarioListElement: JSX.Element = <ListGroupItem action variant="dark" href={'#1'}>No Scenarios Created Yet</ListGroupItem>;
    let noScenarioTabElement: JSX.Element = <Tab.Pane eventKey={'#1'}>
        <h5>No Scenarios Created Yet</h5>
        <p>There are currently no scenarios created yet, go ahead and create a new one!</p>
    </Tab.Pane>
    let scenarioListElements: JSX.Element[] = [];
    let scenarioTabElements: JSX.Element[] = [];
    if (isSuccess) {
        sortedScenarios?.forEach((scenario: any) => {
            scenarioListElements.push(<ListGroupItem action variant="dark" href={'#' + scenario.id} key={scenario.id} onClick={() => selectScenario(scenario.id, scenario.name)}>{scenario.name}</ListGroupItem>);
            scenarioTabElements.push(<Tab.Pane eventKey={'#' + scenario.id} key={scenario.id}>
                <h5>{scenario.name}</h5>
                <p>{scenario.description}</p>
            </Tab.Pane>
            );
        });
    }
    else if (isError) { console.log(error); }

    // Render the component
    return <TabContainer id="scenarioTabContainer">
        {isLoading ? <Spinner /> : null}
        {isError ? <div>Error Loading Scenarios</div> : null}
        <Row>
            <Col>
                {!isError && !isLoading ?
                    <ListGroup>
                        {scenarioListElements.length > 0 ? scenarioListElements : noScenarioListElement}
                    </ListGroup>
                    : null}
                {!isError && !isLoading && scenarioListElements.length > 0 ? <Button onClick={() => openScenario()} style={{ margin: '10px' }}>Open Scenario</Button> : null}
            </Col>
            <Col>
                {!isError && !isLoading ?
                    <Tab.Content>
                        {scenarioTabElements.length > 0 ? scenarioTabElements : noScenarioTabElement}
                    </Tab.Content>
                    : null}
            </Col>
        </Row>
    </TabContainer>
}

export default ScenarioSelector