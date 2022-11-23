// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab } from 'react-bootstrap';
import CreateScenarioPage from './components/createScenarioPage/CreateScenarioPage';
import HomePage from './components/homePage/HomePage'
import PageHeader from './components/pageHeader/PageHeader'

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

        </Tab>
      </Tabs>
    </div>
  )
}

export default App
