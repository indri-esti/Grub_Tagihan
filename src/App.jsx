

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import LandingPage from "./Component/LandingPage";
import Sidnav from "./Component/Sidnav";
import Dashboard from "./Component/Dashboard";
import Tagihan from "./Component/Tagihan";
import JenisTagihan from "./Component/JenisTagihan";
import TambahTagihan from "./Component/TambahTagihan";



  function App() {
    return (

      <Router>
        <Routes>
          
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/sidnav" element={<Sidnav/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tagihan" element={<Tagihan/>}/>
          <Route path="/jenis-tagihan" element={<JenisTagihan/>}/>
          <Route path="/tambah-tagihan" element={<TambahTagihan/>}/>
          

        </Routes>
      </Router>
    );
  }

  export default App;