

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import LandingPage from "./Component/LandingPage";
import Sidnav from "./Component/Sidnav";
import Dashboard from "./Component/Dashboard";



  function App() {
    return (

      <Router>
        <Routes>
          
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/sidnav" element={<Sidnav/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>

          

        </Routes>
      </Router>
    );
  }

  export default App;