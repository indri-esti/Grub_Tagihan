

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import LandingPage from "./Component/LandingPage";
import Sidebar from "./Component/Sidebar";
import Dashboard from "./Component/Dashboard";

import Tagihan from "./Component/Tagihan";
import JenisTagihan from "./Component/JenisTagihan";






  function App() {
    return (

      <Router>
        <Routes>
          
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/sidebar" element={<Sidebar/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          
          <Route path="/tagihan" elment={<Tagihan/>}/>
          <Route path="/jenistagihan" element={<JenisTagihan/>}/>
          
         
          
        
          

        </Routes>
      </Router>
    );
  }

  export default App;