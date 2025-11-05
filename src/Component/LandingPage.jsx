import React from "react";

function LandingPage() {
  const programKeahlianData = [
    {
      jurusan: "Desain Produksi Busana (DPB)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/tabus.jpg",
    },
    {
      jurusan: "Teknik Komputer & Jaringan (TKJ)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/networking/networking6.jpg",
    },
    {
      jurusan: "Desain Komunikasi Visual (DKV)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/dkv/dkv1.jpg",
    },
    {
      jurusan: "Akutansi Dan Keuangan Lembaga (AKL)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/akl/akl3.jpg",
    },
    {
      jurusan: "Teknik Sepeda Motor (TSM)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/tbsm/tbsm1.jpg",
    },
  ];
  return (
    <div>
      <div className="font-sans">
        {/* Navbar */}
        <nav className=" text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">SMK BINANUSANTARA SEMARANG</h1>
          <div className="flex gap-1">
            <a
              href="https://binusasmg.sch.id/ppdb"
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
            >
              Daftar Sekarang
            </a>
            <a
              href="/login"
              className="bg-blue-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-blue-300"
            >
              Login web
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Penerimaan Peserta Didik Baru 2025/2026
          </h2>
          <p className="text-lg mb-6">
            Bergabunglah bersama kami untuk meraih masa depan yang gemilang!
          </p>
        </section>

        {/* Tentang Sekolah */}
        <section className="px-6 py-16 max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Tentang Sekolah</h3>
          <p className="text-gray-600 leading-relaxed">
            SMK BINANUSANTARA SEMARANG merupakan sekolah kejuruan yang
            berkomitmen mencetak lulusan siap kerja, berakhlak mulia, dan
            berdaya saing global. Dengan tenaga pendidik profesional dan
            fasilitas modern, kami siap mengantarkan generasi muda menuju masa
            depan cerah.{" "}
            <a href="https://binusasmg.sch.id/profil-sekolah">
              ayo lihat lebih lanjut tentang SMK Binanusantara Semarang
            </a>
          </p>
        </section>

        {/* Program Keahlian */}
        <section
        // style={{ backgroundImage: `url(${bgImage})` }}
        // className="bg-cover bg-center"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold text-center mb-10">
              Program Keahlian
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {programKeahlianData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                             transform transition-transform duration-300 ease-in-out 
                             hover:-translate-y-2 hover:shadow-xl"
                >
                  <img
                    src={item.img}
                    alt={item.jurusan}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-6">
                    <h4 className="font-semibold text-lg">{item.jurusan}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info PPDB */}
        <section
          id="daftar"
          className="px-6 py-16 max-w-5xl mx-auto text-center"
        >
          <h3 className="text-3xl font-bold mb-8">Info PPDB</h3>
          <ol className="text-left text-gray-700 space-y-4 list-decimal list-inside">
            <li>Isi formulir pendaftaran secara online.</li>
            <li>Unggah dokumen persyaratan.</li>
            <li>Lakukan verifikasi berkas di sekolah.</li>
            <li>Ikuti tes seleksi sesuai jadwal.</li>
            <li>Pengumuman hasil dan daftar ulang.</li>
          </ol>
          <a
            href="https://binusasmg.sch.id/ppdb"
            className="mt-8 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500"
          >
            Daftar Online
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-indigo-700 text-white py-6 text-center">
          <p>© 2025 SMK BINANUSANTARA SEMARANG</p>
          <p className="text-sm">
            Jl. Kemantren Raya No. 10 Wonosari Ngaliyan - Kota Semarang| Telp: (024) 1234567
          </p>
        </footer>
      </div>{" "}
    </div>
  );
}

export default LandingPage;
