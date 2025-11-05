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
import TambahJenis from "./Pages/jenis tagihan/TambahJenis";
import KategoriData from "./Pages/kategori data/KategoriData";

import KategoriTagihan from "./Pages/kategori tagihan/KategoriTagihan";
import TambahKategori from "./Pages/kategori tagihan/TambahKategori";
import EditKategori from "./Pages/kategori tagihan/EditKategori";

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
        <Route path="/tambahjenis" element={<TambahJenis />} />
        <Route path="/kategoritagihan" element={<KategoriTagihan />} />
        <Route path="/kategoridata" element={<KategoriData />} />
        <Route path="/tambahkategori" element={<TambahKategori />} />
        <Route path="/editkategori/:id" element={<EditKategori />} />
        
       
      </Routes> 
  );
}

export default App;
