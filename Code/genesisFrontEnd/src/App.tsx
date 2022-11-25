// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';
import CreateScenarioPage from './components/createScenarioPage/CreateScenarioPage';
import HomePage from './components/homePage/HomePage'
import PageHeader from './components/pageHeader/PageHeader'
import ScenarioDataPage from './components/scenarioDataPage/ScenarioDataPage';

function App() {

  return (
    <div className="App" style={{ backgroundColor: "#242424" }}>
      <PageHeader />
      <Tabs variant='dark' style={{ height: '100%' }}>
        <Tab eventKey="home" title="Home">
          <HomePage />
        </Tab>
        <Tab eventKey="createScenario" title="Create Scenario">
          <CreateScenarioPage />
        </Tab>
        <Tab eventKey="Scenario_Name" title="Scenario Name Here">
          <ScenarioDataPage scenarioId={1} scenarioName='Test_Schmea' templateDataModel={{ name: "first", constellation: "that one", rx: 10, ry: 10, rz: 1, vx: 23, vy: 54, vz: 567 }} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
