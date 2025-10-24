import { Routes, Route } from "react-router-dom";

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import LandingPage from "./Component/LandingPage";
import Dashboard from "./Component/Dashboard";

import JenisTagihan from "./Pages/jenis tagihan/JenisTagihan";

import TambahData from "./Pages/tagihan/TambahData";
import EditData from "./Pages/tagihan/EditData";
import Tagihan from "./Pages/tagihan/Tagihan";
import Editjenis from "./Pages/jenis tagihan/EditJenis";
import Tambahjenis from "./Pages/jenis tagihan/TambahJenis";


function App() {
  return ( 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/jenistagihan" element={<JenisTagihan />} />
        <Route path="/tagihan" element={<Tagihan />} /> 
        <Route path="/tambahdata" element={<TambahData />} />
        <Route path="/editdata/:id" element={<EditData />} />
        <Route path="/editjenis/:id" element={<Editjenis />} />
        <Route path="/tambahjenis" element={<Tambahjenis />} />
      </Routes> 
  );
}

export default App;
