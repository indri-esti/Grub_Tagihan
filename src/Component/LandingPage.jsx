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
      jurusan: "Akuntansi dan Keuangan Lembaga (AKL)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/akl/akl3.jpg",
    },
    {
      jurusan: "Teknik Sepeda Motor (TSM)",
      img: "https://sis.binusasmg.sch.id/assets/dist/img/binusa/tbsm/tbsm1.jpg",
    },
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold text-indigo-700">
          SMK BINANUSANTARA SEMARANG
        </h1>
        <div className="flex gap-2">
          <a
            href="https://binusasmg.sch.id/ppdb"
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Daftar Sekarang
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Login Web
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-center pt-32 pb-20 bg-white">
        <img
          src="https://sis.binusasmg.sch.id/assets/dist/img/binusa/bg-hero.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-700">
            Penerimaan Peserta Didik Baru 2025/2026
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Wujudkan masa depan cerah bersama SMK Binanusantara Semarang!
          </p>
          <a
            href="https://binusasmg.sch.id/ppdb"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Daftar Sekarang
          </a>
        </div>
      </section>

      {/* Tentang Sekolah */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center bg-white shadow-sm rounded-xl">
        <h3 className="text-3xl font-bold mb-4 text-indigo-700">
          Tentang Sekolah
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          <strong>SMK BINANUSANTARA SEMARANG</strong> adalah sekolah kejuruan
          unggulan yang berkomitmen mencetak lulusan siap kerja, berkarakter
          unggul, dan berdaya saing global. Dengan tenaga pendidik profesional
          serta fasilitas pembelajaran modern, kami membantu peserta didik
          mengembangkan potensi terbaiknya.
          <br />
          <a
            href="https://binusasmg.sch.id/profil-sekolah"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Lihat lebih lanjut tentang SMK Binanusantara Semarang →
          </a>
        </p>
      </section>

      {/* Program Keahlian */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-10 text-indigo-700">
            Program Keahlian
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programKeahlianData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={item.img}
                  alt={item.jurusan}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5 text-center">
                  <h4 className="font-semibold text-lg text-indigo-700">
                    {item.jurusan}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info PPDB */}
      <section
        id="daftar"
        className="px-6 py-16 max-w-5xl mx-auto text-center bg-white shadow-sm rounded-xl"
      >
        <h3 className="text-3xl font-bold mb-8 text-indigo-700">Info PPDB</h3>
        <div className="text-left">
          <ol className="text-gray-700 space-y-4 list-decimal list-inside">
            <li>Isi formulir pendaftaran secara online.</li>
            <li>Unggah dokumen persyaratan.</li>
            <li>Lakukan verifikasi berkas di sekolah.</li>
            <li>Ikuti tes seleksi sesuai jadwal.</li>
            <li>Pengumuman hasil dan daftar ulang.</li>
          </ol>
          <div className="text-center mt-10">
            <a
              href="https://binusasmg.sch.id/ppdb"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              Daftar Online Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-8 text-center mt-10">
        <p className="text-lg font-semibold">
          © 2025 SMK BINANUSANTARA SEMARANG
        </p>
        <p className="text-sm mt-2">
          Jl. Kemantren Raya No. 10 Wonosari Ngaliyan - Kota Semarang | Telp:
          (024) 1234567
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
