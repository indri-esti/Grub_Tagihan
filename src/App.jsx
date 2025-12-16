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
import TambahKategoriData from "./Pages/kategori data/TambahKategoriData";
import EditKategoriData from "./Pages/kategori data/EditKategoriData";

import KategoriTagihan from "./Pages/kategori tagihan/KategoriTagihan";
import TambahKategori from "./Pages/kategori tagihan/TambahKategori";
import EditKategori from "./Pages/kategori tagihan/EditKategori";

import DataKelas from "./Pages/Data Kelas/DataKelas";
import TambahDataKelas from "./Pages/Data Kelas/TambahDataKelas";
import EditDataKelas from "./Pages/Data Kelas/EditDataKelas";

import MasterData from "./Pages/master data/MasterData";
import RekapTagihan from "./Pages/rekap tagihan/RekapTagihan";
import TambahDatamaster from "./Pages/master data/TambahMasterData";
import EditMasterData from "./Pages/master data/EditMasterData";

import RekapPresensi from "./Pages/presensi/Rekappresensi";
import PresensiMasuk from "./Pages/presensi/PresensiMasuk";
import PresensiPulang from "./Pages/presensi/PresensiPulang";
import PresensiSiswa from "./Pages/presensi/PresensiSiswa";
import IzinPresensi from "./Pages/presensi/IzinPresensi";
import EditPresensi from "./Pages/presensi/EditPresensi";

import KategoriIzin from "./Pages/kategori izin presensi/KategoriIzin";
import TambahDataKategori from "./Pages/kategori izin presensi/TambahDataKategori";
import EditDataKategori from "./Pages/kategori izin presensi/EditDataKategori";




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
        <Route path="/tambah_kategoridata" element={<TambahKategoriData />} />
        <Route path="/edit_kategoridata/:id" element={<EditKategoriData />} />

        <Route path="/datakelas" element={<DataKelas />} />
        <Route path="/tambah_datakelas" element={<TambahDataKelas />} />
        <Route path="/edit_datakelas/:id" element={<EditDataKelas />} />

        <Route path="/tambahkategori" element={<TambahKategori />} />
        <Route path="/editkategori/:id" element={<EditKategori />} />
        
        <Route path="/masterdata" element={<MasterData />} />
        <Route path="/tambahmasterdata" element={<TambahDatamaster />} />
        <Route path="/editmasterdata/:id" element={<EditMasterData />} />
        <Route path="/rekaptagihan" element={<RekapTagihan />}/>
       
        <Route path="/rekappresensi" element={<RekapPresensi />} />
        <Route path="/presensimasuk" element={<PresensiMasuk />} />
        <Route path="/presensipulang" element={<PresensiPulang />} />
        <Route path="/presensi" element={<PresensiSiswa />} />
        <Route path="/izinpresensi" element={<IzinPresensi />} />
        <Route path="/editpresensi/:id" element={<EditPresensi />} />

        <Route path="/kategoriizin" element={<KategoriIzin />} />
        <Route path="/tambahkategoriizin" element={<TambahDataKategori />} />
        <Route path="/editkategoriizin/:id" element={<EditDataKategori />} />
        
      </Routes> 
  );
}

export default App;
