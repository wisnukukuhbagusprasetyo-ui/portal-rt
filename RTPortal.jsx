import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RTPortal() {
  const [active, setActive] = useState("beranda");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="p-4 border-b bg-white sticky top-0 z-20 flex items-center justify-between">
        <h1 className="text-xl font-bold">Portal RT 01/RW 08</h1>
        <nav className="flex gap-2">
          <Button onClick={() => setActive("beranda")}>Beranda</Button>
          <Button onClick={() => setActive("warga")}>Data Warga</Button>
          <Button onClick={() => setActive("berita")}>Berita</Button>
          <Button onClick={() => setActive("pengaduan")}>Pengaduan</Button>
          <Button onClick={() => setActive("kas")}>Kas</Button>
          <Button onClick={() => setActive("surat")}>Kop Surat</Button>
          <Button onClick={() => setActive("set")}>Pengaturan</Button>
        </nav>
      </header>

      <main className="p-6">
        {active === "beranda" && <p>👋 Selamat datang di Portal RT</p>}
        {active === "warga" && <p>📋 Manajemen Data Warga</p>}
        {active === "berita" && <p>📰 Berita & Agenda RT</p>}
        {active === "pengaduan" && <p>📢 Pengaduan Warga</p>}
        {active === "kas" && <p>💰 Transparansi Kas RT</p>}
        {active === "surat" && <p>📄 Generator Kop Surat</p>}
        {active === "set" && <p>⚙️ Pengaturan Profil RT</p>}
      </main>
    </div>
  );
}
