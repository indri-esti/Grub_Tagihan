

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import LandingPage from "./Component/LandingPage";
import Sidebar from "./Component/Sidebar";
import Dashboard from "./Component/Dashboard";


import JenisTagihan from "./Component/JenisTagihan";
import Tagihan from "./Component/Tagihan";







  function App() {
    return (

      <Router>
        <Routes>
          
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/Sidebar" element={<Sidebar/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          
          
          <Route path="/jenis-tagihan" element={<JenisTagihan/>}/>
          <Route path="/tagihan" element={<Tagihan/>}/>
          
          
         
          
        
          

        </Routes>
      </Router>
    );
  }

  export default App;