// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import CreateScenarioPage from './components/createScenarioPage/CreateScenarioPage';
import HomePage from './components/homePage/HomePage'
import PageHeader from './components/pageHeader/PageHeader'
import ScenarioDataPage from './components/scenarioDataPage/ScenarioDataPage';

let openScenarioTabs: number[] = [];
let isCreateScenarioTabOpen = false;

function App() {
  // Local state
  const [openTabs, setOpenTabs] = useState<any[]>([]);

  // Opening Tab Functions
  const openCreateScenarioTab = () => {
    if (!isCreateScenarioTabOpen) {
      isCreateScenarioTabOpen = true;
      setOpenTabs([{ type: "create" }, ...openTabs]);
    }
  }

  const closeCreateTab = () => {
    let currentTabs = openTabs.slice();
    currentTabs = currentTabs.filter(tab => tab.type !== "create");
    isCreateScenarioTabOpen = false;
    setOpenTabs(currentTabs);
  }

  const closeScenarioTab = (scenarioId: number) => {
    let currentTabs = openTabs.slice();
    currentTabs = currentTabs.filter(tab => tab.scenarioId !== scenarioId);
    openScenarioTabs = openScenarioTabs.filter(id => id !== scenarioId);
    setOpenTabs(currentTabs);
  }

  const openScenarioTab = (scenarioId: number, scenarioName: string) => {
    if (!openScenarioTabs.find(id => id == scenarioId)) {
      setOpenTabs([...openTabs, { type: "scenario", scenarioId: scenarioId, scenarioName: scenarioName }]);
      openScenarioTabs.push(scenarioId);
    }
  }

  return (
    <div className="App" style={{ backgroundColor: "#242424" }}>
      <PageHeader />
      <Tabs variant='dark' style={{ height: '100%' }}>
        <Tab eventKey="home" title="Home">
          <HomePage openCreateScenarioTabFcn={openCreateScenarioTab} openScenarioTabFcn={openScenarioTab} />
        </Tab>
        {openTabs.length ? openTabs.map((tabData, index) => {
          if (tabData.type == "scenario") {
            return <Tab key={index} eventKey={tabData.scenarioName} title={<>{tabData.scenarioName} <Button variant='link' size='sm' onClick={() => closeScenarioTab(tabData.scenarioId)}>X</Button></>}>
              <ScenarioDataPage scenarioId={tabData.scenarioId} />
            </Tab>
          } else if (tabData.type == "create") {
            return <Tab key={index} eventKey="createScenario" title="Create Scenario">
              <CreateScenarioPage closeCreateTabFcn={closeCreateTab} />
            </Tab>
          }
        }) : null}
      </Tabs>
    </div>
  )
}

export default App
