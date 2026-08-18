import Link from "next/link";
import Navbar from "./ui/navbar/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to BIT-Veriface</h1>
        <p className="text-xl mb-8 max-w-2xl text-base-content/70">
          Sistem Pengenalan Wajah untuk Pencarian Foto Dokumentasi Lari Berbasis FaceNet dan KNN.
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="btn btn-primary btn-lg">
            Mulai Sekarang
          </Link>
        </div>
      </div>
      
      {/* Feature section */}
      <div className="bg-base-100 py-20 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">📸 Photographer</h2>
              <p>Upload foto dengan mudah menggunakan fitur multi-file upload. Otomatis generate thumbnail untuk akses galeri yang lebih cepat.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">🏃‍♂️ Runner</h2>
              <p>Temukan foto lari Anda dengan cepat menggunakan pengenalan wajah. Cukup upload foto wajah Anda dan biarkan AI mencari.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">⚡ Cepat & Akurat</h2>
              <p>Didukung oleh arsitektur FaceNet dan milvus vector database untuk pencarian nearest neighbor yang efisien pada dataset berskala besar.</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © {new Date().getFullYear()} - Prototype Skripsi BIT-Veriface</p>
        </div>
      </footer>
    </main>
  );
}
