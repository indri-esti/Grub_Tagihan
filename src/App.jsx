import { Route, Routes } from "react-router-dom";

import Sidnav from "./Components/Sidnav";
import Dashboard from "./Components/Dashboard";

import Navbar from "./Components/Navbar";

function App() {
  return ( 
    <Routes>

      <Route path="/" element={<Sidnav/>}/>
      <Route path="dashboard" element={<Dashboard/>}/>

      <Route path="/navbar" element={<Navbar/>}/>

    </Routes>
  );
}

export default App;
