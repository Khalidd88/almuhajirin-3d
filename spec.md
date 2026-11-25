# SPEC: Reimagine Musholla Al Muhajirin (3D & WebXR)

## 1. Konteks Proyek
- **Objek:** Musholla Al Muhajirin, Jl. Bumi Bahagia, Perumahan Bumi Anggrek, Bekasi.
- **Tujuan:** Visualisasi 3D & WebXR interaktif (Before vs After) untuk tugas individu PAI.
- **Referensi Visual:** Foto Google Street View asli (kondisi eksisting) sebagai acuan proporsi 1:1.

## 2. Tech Stack & Setup Wajib
- **Framework:** Vite + React (JSX) + Tailwind CSS v4 (`@tailwindcss/vite`).
- **3D & WebXR:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/xr`, `lucide-react`.
- **Kompatibilitas Versi:** Pastikan `@react-three/fiber@9` untuk `react@19` (atau `@react-three/fiber@8` untuk `react@18`). Gunakan `--legacy-peer-deps` jika ada konflik peer dependency.
- **Testing WebXR di HP (HTTPS):** Pasang `@vitejs/plugin-basic-ssl` di `vite.config.js` dan aktifkan `server: { host: true }` agar WebXR bisa langsung dibuka lewat IP lokal di HP via HTTPS.

## 3. Aturan Performa (Wajib 60 FPS di HP, Tablet, Laptop)
- **100% Procedural Geometry:** Bangun seluruh objek memakai geometri Three.js (`Box`, `Cylinder`, `Plane`, `Extrude`). Dilarang load file `.glb`/`.gltf` eksternal atau tekstur resolusi 4K.
- **Deteksi Mobile:**
  - `dpr={isMobile ? 1 : [1, 1.5]}`
  - `gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}`
- **Pencahayaan Ringan:** Maksimal 1 `directionalLight` dengan `castShadow`, `shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}`, dan shadow frustum ketat hanya membungkus area musholla. Tanpa Post-Processing (Bloom/SSAO).
- **Instancing:** Gunakan `InstancedMesh` / `<Instances>` untuk objek berulang (lubang roster terakota, bilah kisi kayu, panel surya, garis shaf, tanaman).
- **Material:** `MeshLambertMaterial` untuk rumah tetangga/lingkungan jauh, `MeshStandardMaterial` sederhana untuk musholla.

## 4. Struktur Komponen (`src/components/`)
- `Scene.jsx`: Canvas R3F, lighting Sore (Ashar) & Malam (Isya), OrbitControls smooth lerp, wrapper `@react-three/xr`.
- `Neighborhood.jsx`: Aspal gang Jl. Bumi Bahagia di kiri, halaman kanan, blok rumah tetangga low-poly warna redup (rumah bata 2 lantai di belakang kiri, rumah biru di belakang kanan), dan lubang biopori di pinggir gang.
- `BeforeMusholla.jsx` (1:1 mirip foto asli):
  - Kiri: dinding krem/salem, lis plang, 1 jendela lengkung putih, roster lama bagian atas.
  - Kanan bawah kanopi: dinding hijau terang, 2 pintu ganda lengkung putih, 1 jendela tengah, undakan batu alam, papan nama "MUSHOLLA AL MUHAJIRIN", 2 outdoor AC.
  - Pagar besi merah marun di depan kiri & gerbang kanan, atap genteng limasan + kubah perak kecil, kanopi baja ringan miring ke kanan.
- `AfterMusholla.jsx` (Denah, tiang kanopi, dan kubah perak tetap di posisi yang sama):
  - Gang kiri: pagar merah marun dilepas agar jalan gang kiri 100% plong buat mobil/motor warga. Dinding krem diganti roster bata terakota + kisi kayu + pot tipis mepet tembok.
  - Teras kanan bawah kanopi: undakan diganti dek kayu hangat + ramp landai lansia. Dinding hijau diganti kisi kayu + pintu kaca geser bingkai hitam + papan nama menyala saat malam.
  - Atap kanopi: panel surya (solar roof).
  - Properti (semua di dalam garis tiang kanopi): meja & bangku belajar (laptop + colokan), 2 gerobak kayu sarapan warga (stand QRIS), Kulkas Berbagi pintu kaca transparan isi kotak makan.
  - Sudut belakang kanan: area wudhu terpisah pria/wanita berpartisi roster, rak sandal rapi, dan sudut parkir motor kecil.
- `InteriorSpace.jsx`: Mihrab minimalis, mimbar kayu kecil, garis shaf sajadah, partisi geser jamaah perempuan, rak Al-Qur'an & mukena, jam jadwal sholat LED, kipas angin gantung berputar pelan.
- `SmartTV.jsx`: Layar TV dinding teras memakai HTML5 `CanvasTexture` dinamis (jadwal sholat, saldo kas QRIS transparan, output panel surya dalam Watt, jadwal kegiatan warga).
- `WindSimulation.jsx`: Toggle aliran angin cross-ventilation halus masuk lewat roster terakota.
- `HUD.jsx`: UI responsif (`100dvh`, `touch-action: none` di canvas). Kontrol atas: Before/After, Sore/Malam, Simulasi Angin, Sembunyikan UI, Masuk VR. Kontrol bawah: 6 preset kamera (Ikhtisar, Ibadah, Pendidikan, Sosial, Ekonomi, Digital) dengan kartu info bahasa santai. Di HP: tombol bawah scroll horizontal (`overflow-x-auto`) dan kartu info berupa bottom sheet yang bisa di-minimize.

## 5. Tahapan Pengerjaan
- [ ] **Tahap 1:** Setup Vite + packages + `Scene`, `Neighborhood`, `BeforeMusholla`, `AfterMusholla` + toggle sementara Before/After & Sore/Malam.
- [ ] **Tahap 2:** Tambah `InteriorSpace`, properti 3 program unggulan & wudhu, `SmartTV`, dan `WindSimulation`.
- [ ] **Tahap 3:** Finishing `HUD.jsx` responsif (HP/Tablet/Laptop), 6 preset tur kamera smooth lerp, integrasi tombol VR, dan verifikasi `npm run build` bebas error.