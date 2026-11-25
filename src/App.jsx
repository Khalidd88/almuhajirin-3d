import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Eye,
  EyeOff,
  Glasses,
  ChevronDown,
  ChevronUp,
  Compass,
  Building2,
  Droplets,
  BookOpen,
  HeartHandshake,
  Store,
  MonitorSmartphone,
  Map,
  Wind,
  Users,
  Footprints,
} from 'lucide-react';
import Scene, { xrStore } from './components/Scene';
import VirtualJoystick from './components/VirtualJoystick';

const TOUR_ZONES = [
  {
    id: 'ikhtisar',
    label: 'Ikhtisar',
    icon: Compass,
    title: 'Musholla Al Muhajirin',
    beforeDesc:
      'Tampak eksisting di Jl. Bumi Bahagia, Bumi Anggrek, Bekasi. Kavling 281 m² dengan dinding krem di sisi gang kiri, dinding hijau di lorong kanopi kanan, serta pagar besi merah marun.',
    afterDesc:
      'Wajah baru tanpa mengubah denah utama dan kubah perak. Pagar kiri dilepas agar gang warga plong, fasad diganti roster terakota, kisi kayu hangat, dan kanopi panel surya.',
  },
  {
    id: 'ibadah',
    label: 'Ruang Sholat',
    icon: Building2,
    title: 'Pusat Ibadah Nyaman',
    beforeDesc:
      'Ruang sholat utama dengan mihrab menghadap kiblat, karpet hijau klasik, tirai sekat jamaah perempuan, serta pintu ganda putih yang bisa diklik untuk buka dan tutup.',
    afterDesc:
      'Interior terang dengan partisi kayu geser yang lega untuk jamaah perempuan, mihrab beraksen kayu dan LED hangat, jam jadwal sholat digital, serta kipas plafon hemat energi.',
  },
  {
    id: 'wudhu',
    label: 'Wudhu & WC',
    icon: Droplets,
    title: 'Area Wudhu & Sanitasi',
    beforeDesc:
      'Lorong wudhu pria terbuka berderet di sisi kiri belakang, area wudhu wanita terbuka di pojok kanan belakang, serta bilik WC tertutup di sebelahnya.',
    afterDesc:
      'Tetap mengikuti jalur pipa asli, ditambah partisi privasi untuk area wudhu wanita, keramik lantai yang lebih aman untuk lansia, serta rak sandal kayu bertingkat di dekat pintu.',
  },
  {
    id: 'pendidikan',
    label: 'Pendidikan',
    icon: BookOpen,
    title: 'Ruang Belajar & Literasi',
    beforeDesc:
      'Area lorong di bawah kanopi baja ringan masih berupa pelataran semen kosong yang umumnya hanya dipakai saat sholat berjamaah.',
    afterDesc:
      'Teras dek kayu hangat di dalam garis tiang kanopi dilengkapi meja belajar, colokan listrik, dan akses bacaan untuk anak mengaji maupun pelajar sekitar.',
  },
  {
    id: 'sosial',
    label: 'Sosial',
    icon: HeartHandshake,
    title: 'Kulkas Berbagi & Akses Lansia',
    beforeDesc:
      'Undakan batu alam di sisi dinding hijau cukup tinggi bagi jamaah lanjut usia dan belum tersedia fasilitas berbagi pangan mandiri.',
    afterDesc:
      'Dilengkapi jalur landai ramah lansia di bagian depan teras serta Kulkas Berbagi berpintu kaca transparan agar warga bisa menaruh atau mengambil makanan kapan saja.',
  },
  {
    id: 'ekonomi',
    label: 'Ekonomi',
    icon: Store,
    title: 'Gerobak UMKM Warga',
    beforeDesc:
      'Bagian tengah hingga belakang lorong kanopi belum dimanfaatkan untuk aktivitas pemberdayaan ekonomi jamaah sekitar.',
    afterDesc:
      'Tersedia gerobak kayu rapi untuk sarapan warga selepas Subuh dengan pembayaran QRIS agar ekonomi mikro jamaah ikut bergerak tanpa mengganggu akses jalan gang.',
  },
  {
    id: 'digital',
    label: 'Digital',
    icon: MonitorSmartphone,
    title: 'Smart TV & Panel Surya',
    beforeDesc:
      'Informasi kegiatan dan keuangan musholla masih mengandalkan papan pengumuman manual serta pasokan listrik PLN penuh.',
    afterDesc:
      'Layar informasi digital menampilkan jadwal sholat, kas QRIS transparan, dan produksi listrik real time dari panel surya di atas kanopi.',
  },
  {
    id: 'atas',
    label: 'Tampak Atas',
    icon: Map,
    title: 'Peta Lingkungan 1:1',
    beforeDesc:
      'Skala nyata 14m × 20m mengikuti pengukuran Google Earth, lengkap dengan gang kiri Jl. Bumi Bahagia, gang tembus kanan, 2 rumah tetangga belakang, dan pertigaan gang belok kanan.',
    afterDesc:
      'Seluruh renovasi tetap berada di dalam batas kavling asli sehingga sirkulasi kendaraan warga di gang kiri maupun gang kanan tetap lancar.',
  },
];

export default function App() {
  const [mode, setMode] = useState('before');
  const [isNight, setIsNight] = useState(false);
  const [activePreset, setActivePreset] = useState('ikhtisar');
  const [presetTrigger, setPresetTrigger] = useState(0);
  const [windSimulation, setWindSimulation] = useState(false);
  const [showCrowd, setShowCrowd] = useState(true);
  const [showJoystick, setShowJoystick] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [cardMinimized, setCardMinimized] = useState(false);
  const [vrError, setVrError] = useState('');
  const joystickRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch =
      window.innerWidth <= 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    if (isTouch) setShowJoystick(true);
  }, []);

  const activeZone = TOUR_ZONES.find((z) => z.id === activePreset) || TOUR_ZONES[0];

  const handleEnterVR = async () => {
    setVrError('');
    try {
      await xrStore.enterVR();
    } catch {
      setVrError('Browser ini belum mendukung WebXR VR. Coba buka lewat HTTPS di HP atau aktifkan emulator WebXR.');
      setTimeout(() => setVrError(''), 4500);
    }
  };

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-slate-950 select-none font-sans">
      {/* Kanvas 3D & WebXR */}
      <Scene
        mode={mode}
        isNight={isNight}
        activePreset={activePreset}
        presetTrigger={presetTrigger}
        windSimulation={windSimulation}
        showCrowd={showCrowd}
        joystickRef={joystickRef}
      />

      {/* Virtual Joystick untuk Jalan di HP / Touch Screen */}
      {!hideUI && showJoystick && (
        <div className="pointer-events-none fixed bottom-20 right-3.5 z-30 sm:bottom-24 sm:right-6">
          <VirtualJoystick joystickRef={joystickRef} visible={true} />
        </div>
      )}

      {/* Tombol Munculkan UI kembali saat mode Sembunyikan UI aktif */}
      {hideUI && (
        <button
          type="button"
          onClick={() => setHideUI(false)}
          className="fixed top-4 right-4 z-30 flex items-center gap-2 rounded-full bg-slate-900/85 px-4 py-2 text-xs font-medium text-white backdrop-blur-md border border-white/15 shadow-lg hover:bg-slate-800 transition"
        >
          <Eye className="w-4 h-4" />
          <span>Tampilkan UI</span>
        </button>
      )}

      {/* Notifikasi VR singkat jika perangkat belum mendukung */}
      {vrError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-sm rounded-xl bg-amber-950/90 border border-amber-500/40 px-4 py-2.5 text-center text-xs text-amber-100 backdrop-blur-md shadow-xl">
          {vrError}
        </div>
      )}

      {/* =====================================================================
          HUD ATAS (JUDUL + KONTROL UTAMA)
          ===================================================================== */}
      {!hideUI && (
        <header className="pointer-events-none fixed top-0 inset-x-0 z-20 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
          {/* Badge Identitas Proyek */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-slate-900/80 px-3.5 py-2 text-white backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-400/30">
              3D
            </div>
            <div className="leading-tight">
              <h1 className="text-xs sm:text-sm font-semibold tracking-tight">
                Reimagine Musholla Al Muhajirin
              </h1>
              <p className="text-[11px] text-slate-300">
                Jl. Bumi Bahagia, Bekasi • {mode === 'before' ? 'Kondisi Asli' : 'Desain Baru'}
              </p>
            </div>
          </div>

          {/* Deretan Tombol Kontrol Atas */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Toggle Before vs After */}
            <div className="flex items-center rounded-full bg-slate-900/80 p-1 backdrop-blur-md border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setMode('before')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === 'before'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Before (Asli)
              </button>
              <button
                type="button"
                onClick={() => setMode('after')}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === 'after'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                After (Baru)
              </button>
            </div>

            {/* Toggle Sore / Malam */}
            <button
              type="button"
              onClick={() => setIsNight((prev) => !prev)}
              title="Ubah Waktu Sore / Malam"
              className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-2 text-xs font-medium text-white backdrop-blur-md border border-white/10 shadow-lg hover:bg-slate-800 transition"
            >
              {isNight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="hidden sm:inline">Malam (Isya)</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Sore (Ashar)</span>
                </>
              )}
            </button>

            {/* Toggle Simulasi Aliran Angin (Cross Ventilation) */}
            <button
              type="button"
              onClick={() => setWindSimulation((prev) => !prev)}
              title="Simulasi Aliran Angin Cross Ventilation"
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium backdrop-blur-md border shadow-lg transition ${
                windSimulation
                  ? 'bg-sky-600 text-white border-sky-400/40 shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wind className={`w-3.5 h-3.5 ${windSimulation ? 'text-cyan-200 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Angin</span>
            </button>

            {/* Toggle Aktivitas Warga & Kendaraan */}
            <button
              type="button"
              onClick={() => setShowCrowd((prev) => !prev)}
              title="Tampilkan / Sembunyikan Warga & Kendaraan"
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium backdrop-blur-md border shadow-lg transition ${
                showCrowd
                  ? 'bg-amber-500/90 text-slate-950 border-amber-300/40 shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Warga</span>
            </button>

            {/* Toggle Joystick Jalan (HP & Laptop) */}
            <button
              type="button"
              onClick={() => setShowJoystick((prev) => !prev)}
              title="Tampilkan / Sembunyikan Joystick Jalan (atau pakai WASD di keyboard)"
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium backdrop-blur-md border shadow-lg transition ${
                showJoystick
                  ? 'bg-emerald-500/90 text-slate-950 border-emerald-300/40 shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jalan</span>
            </button>

            {/* Tombol Masuk VR */}
            <button
              type="button"
              onClick={handleEnterVR}
              title="Masuk Mode WebXR VR"
              className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md border border-emerald-400/30 shadow-lg hover:bg-emerald-500 transition"
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>VR</span>
            </button>

            {/* Tombol Sembunyikan UI */}
            <button
              type="button"
              onClick={() => setHideUI(true)}
              title="Sembunyikan UI untuk Screenshot"
              className="flex items-center justify-center rounded-full bg-slate-900/80 p-2 text-slate-200 backdrop-blur-md border border-white/10 shadow-lg hover:bg-slate-800 hover:text-white transition"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* =====================================================================
          HUD BAWAH (KARTU INFO + 8 PRESET TUR KAMERA RESPONSIF)
          ===================================================================== */}
      {!hideUI && (
        <section className="pointer-events-none fixed bottom-0 inset-x-0 z-20 flex flex-col gap-2.5 p-3 sm:p-4">
          {/* Kartu Info Zona Aktif (Collapsible Bottom Sheet) */}
          <div
            className={`pointer-events-auto rounded-2xl bg-slate-900/82 text-white backdrop-blur-md border border-white/10 shadow-xl overflow-hidden transition-all ${
              showJoystick ? 'w-[calc(100%-7.25rem)] sm:w-full max-w-md' : 'w-full max-w-md'
            }`}
          >
            <button
              type="button"
              onClick={() => setCardMinimized((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    mode === 'before' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">
                  {activeZone.title}
                </span>
              </div>
              {cardMinimized ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {!cardMinimized && (
              <div className="px-4 pb-3 pt-0.5 space-y-2">
                <p className="text-xs leading-relaxed text-slate-300">
                  {mode === 'before' ? activeZone.beforeDesc : activeZone.afterDesc}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10 gap-2">
                  <span>Geser orbit • WASD / Joystick untuk jalan</span>
                  <span className="shrink-0 text-emerald-400 font-medium">WebXR Ready</span>
                </div>
              </div>
            )}
          </div>

          {/* Deretan Tombol Preset Kamera (Scroll Horizontal mulus di HP) */}
          <nav className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {TOUR_ZONES.map((zone) => {
              const Icon = zone.icon;
              const isActive = activePreset === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => {
                    setActivePreset(zone.id);
                    setPresetTrigger((c) => c + 1);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium backdrop-blur-md border transition ${
                    isActive
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-slate-900/75 text-slate-200 border-white/10 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{zone.label}</span>
                </button>
              );
            })}
          </nav>
        </section>
      )}
    </main>
  );
}