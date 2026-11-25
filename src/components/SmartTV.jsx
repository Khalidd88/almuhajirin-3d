import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SmartTV: Layar Informasi Digital Interaktif Dinding Teras Musholla
 * Menggunakan HTML5 CanvasTexture tajam (512x288, rasio 16:9)
 * Menampilkan:
 * 1. Header Musholla Al Muhajirin Digital Board & Jam Digital
 * 2. Jadwal Sholat 5 Waktu & Hitung Mundur Waktu Sholat Berikutnya
 * 3. Transparansi Kas QRIS (Saldo Kas & Pemasukan Pekan Ini)
 * 4. Output Daya Panel Surya Real-time (Sore: 1.420 W Surplus / Malam: Mode Baterai 88%)
 * 5. Jadwal Kegiatan Warga (TPA Anak, Kajian Pekanan, Sarapan Berkah UMKM)
 */
export default function SmartTV({
  position = [3.08, 2.1, 2.0],
  rotation = [0, Math.PI / 2, 0],
  isNight = false,
}) {
  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  // Buat canvas dan tekstur sekali
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 288;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return { canvas: c, texture: tex };
  }, []);

  canvasRef.current = canvas;
  textureRef.current = texture;

  // Render konten digital board ke canvas
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. Background TV Modern Dark UI ---
    ctx.fillStyle = '#070b12';
    ctx.fillRect(0, 0, 512, 288);

    // Subtle header gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 42);

    // Header Accent Line
    ctx.fillStyle = '#34d399';
    ctx.fillRect(0, 42, 512, 2);

    // --- 2. Header Text & Jam Digital ---
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MUSHOLLA AL MUHAJIRIN DIGITAL BOARD', 14, 26);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(isNight ? '19:45:20 WIB' : '15:35:10 WIB', 498, 26);

    // --- 3. Kartu Jadwal Sholat 5 Waktu (Grid Horizontal) ---
    const prayers = [
      { name: 'SUBUH', time: '04:12' },
      { name: 'DZUHUR', time: '11:44' },
      { name: 'ASHAR', time: '15:08' },
      { name: 'MAGHRIB', time: '17:56' },
      { name: 'ISYA', time: '19:10' },
    ];

    const activeIndex = isNight ? 4 : 2; // Isya di malam hari, Ashar di sore hari

    prayers.forEach((p, idx) => {
      const boxW = 92;
      const boxH = 46;
      const bx = 14 + idx * (boxW + 8);
      const by = 52;
      const isActive = idx === activeIndex;

      // Box background
      ctx.fillStyle = isActive ? '#065f46' : '#111827';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 6);
      ctx.fill();

      // Border highlight
      ctx.lineWidth = isActive ? 1.5 : 1;
      ctx.strokeStyle = isActive ? '#34d399' : '#1f2937';
      ctx.stroke();

      // Nama Sholat
      ctx.fillStyle = isActive ? '#a7f3d0' : '#9ca3af';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, bx + boxW / 2, by + 16);

      // Waktu Sholat
      ctx.fillStyle = isActive ? '#ffffff' : '#e5e7eb';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(p.time, bx + boxW / 2, by + 36);
    });

    // --- 4. Kolom Kiri: Kas QRIS & Panel Surya ---
    // A. Widget Kas QRIS Transparan
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(14, 106, 238, 80, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TRANSPARANSI KAS QRIS', 24, 126);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText('Saldo Kas Operasional:', 24, 144);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Rp 14.850.000', 24, 162);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText('Pekan Ini: +Rp 2.450.000 (QRIS)', 24, 178);

    // B. Widget Panel Surya (Solar Roof)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(14, 194, 238, 80, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PANEL SURYA ATAP (SOLAR ROOF)', 24, 214);

    if (isNight) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('Mode Malam: Baterai Cadangan', 24, 232);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('Baterai: 88% • Beban: 280 W', 24, 250);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '9px sans-serif';
      ctx.fillText('Mandiri Listrik • Emisi 0 Kg CO₂', 24, 266);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('Produksi Daya Saat Ini (Sore):', 24, 232);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('1.420 Watt  [Surplus]', 24, 250);
      ctx.fillStyle = '#4ade80';
      ctx.font = '9px sans-serif';
      ctx.fillText('Baterai 96% • Ekspor Net Metering', 24, 266);
    }

    // --- 5. Kolom Kanan: Jadwal Kegiatan Warga & Pengumuman ---
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(260, 106, 238, 168, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('JADWAL KEGIATAN & SOSIAL WARGA', 272, 126);

    const activities = [
      {
        badge: 'HARI INI',
        title: 'TPA Anak-Anak & Tahsin Quran',
        detail: '16:00 - 17:30 WIB • Teras Pendidikan',
        color: '#34d399',
      },
      {
        badge: 'RUTIN',
        title: 'Sarapan Berkah UMKM Warga',
        detail: 'Bada Subuh • Gerobak Teras Sebelah Kanan',
        color: '#f59e0b',
      },
      {
        badge: 'SOSIAL',
        title: 'Kulkas Berbagi Pangan Terbuka',
        detail: '24 Jam • Silakan Taruh / Ambil Secukupnya',
        color: '#38bdf8',
      },
    ];

    activities.forEach((act, i) => {
      const ay = 142 + i * 42;

      // Badge
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(272, ay - 9, 52, 15, 3);
      ctx.fill();
      ctx.fillStyle = act.color;
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(act.badge, 298, ay + 2);

      // Title & detail
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(act.title, 330, ay + 2);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText(act.detail, 272, ay + 19);
    });

    texture.needsUpdate = true;
  }, [canvas, texture, isNight]);

  return (
    <group position={position} rotation={rotation}>
      {/* Braket / Tiang Mount TV ke Dinding */}
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[0.5, 0.4, 0.04]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Bingkai TV Hitam Ramping (Ukuran ~60 Inch: 1.4m x 0.82m) */}
      <mesh castShadow>
        <boxGeometry args={[1.42, 0.84, 0.035]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Panel Layar Display (CanvasTexture) */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.38, 0.8]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.2}
          metalness={0.1}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={isNight ? 0.95 : 0.65}
        />
      </mesh>

      {/* Cahaya Pendar Lembut dari Layar TV saat Malam */}
      {isNight && (
        <pointLight position={[0, 0, 0.4]} intensity={2.2} distance={4} color="#6ee7b7" />
      )}
    </group>
  );
}
