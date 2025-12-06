import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="font-sans bg-gray-50 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">
          SMK BINANUSANTARA SEMARANG
        </h1>

        <div className="flex gap-3">
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

      {/* HERO */}
      <section className="relative pt-32 pb-24 text-center bg-white overflow-hidden">
        <motion.img
          src="https://sis.binusasmg.sch.id/assets/dist/img/binusa/bg-hero.jpg"
          alt="Hero background SMK Binanusantara"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-5">
            Penerimaan Peserta Didik Baru 2025/2026
          </h2>

          <p className="text-lg md:text-xl mb-6 text-gray-700">
            Wujudkan masa depan cerah bersama SMK Binanusantara Semarang!
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://binusasmg.sch.id/ppdb"
            className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition"
          >
            Daftar Sekarang
          </motion.a>
        </motion.div>
      </section>

      {/* TENTANG SEKOLAH */}
      <motion.section
        className="px-6 py-16 max-w-5xl mx-auto bg-white shadow-sm rounded-xl mt-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
          Tentang Sekolah
        </h3>

        <p className="text-gray-700 leading-relaxed text-lg text-center">
          <strong>SMK BINANUSANTARA SEMARANG</strong> adalah sekolah kejuruan
          unggulan yang berkomitmen mencetak lulusan siap kerja, berkarakter
          unggul, dan berdaya saing global. Dengan tenaga pendidik profesional
          serta fasilitas pembelajaran modern, kami membantu peserta didik
          mengembangkan potensi terbaiknya.
        </p>

        <p className="text-center mt-4">
          <a
            href="https://binusasmg.sch.id/profil-sekolah"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Lihat lebih lanjut tentang SMK Binanusantara Semarang →
          </a>
        </p>
      </motion.section>

      {/* PROGRAM KEAHLIAN */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-10 text-indigo-700">
            Program Keahlian
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programKeahlianData.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <img
                  src={item.img}
                  alt={item.jurusan}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4 text-center">
                  <h4 className="font-semibold text-lg text-indigo-700">
                    {item.jurusan}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO PPDB */}
      <motion.section
        id="daftar"
        className="px-6 py-16 max-w-5xl mx-auto bg-white shadow-sm rounded-xl"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-3xl font-bold mb-8 text-indigo-700 text-center">
          Info PPDB
        </h3>

        <div className="text-left mx-auto max-w-2xl">
          <ol className="list-decimal list-inside text-gray-700 space-y-4 text-lg">
            <li>Isi formulir pendaftaran secara online.</li>
            <li>Unggah dokumen persyaratan.</li>
            <li>Verifikasi berkas di sekolah.</li>
            <li>Ikuti tes seleksi sesuai jadwal.</li>
            <li>Pengumuman hasil dan daftar ulang.</li>
          </ol>

          <div className="text-center mt-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://binusasmg.sch.id/ppdb"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition inline-block"
            >
              Daftar Online Sekarang
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-blue-700 text-white py-8 text-center mt-12">
        <p className="text-lg font-semibold">© 2025 SMK BINANUSANTARA SEMARANG</p>
        <p className="text-sm mt-2">
          Jl. Kemantren Raya No. 10 Wonosari Ngaliyan - Kota Semarang | Telp:
          (024) 1234567
        </p>
      </footer>
    </motion.div>
  );
}

export default LandingPage;
