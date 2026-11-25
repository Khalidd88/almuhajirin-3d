import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import SmartTV from './SmartTV';

/* ============================================================================
   1. PROCEDURAL TEXTURES KHUSUS DESAIN AFTER (MAX 256px, 60 FPS)
   ============================================================================ */

function createWoodPlankTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Base warna kayu jati / bengkirai outdoor hangat
  ctx.fillStyle = '#8f5734';
  ctx.fillRect(0, 0, 256, 128);

  // Nat papan kayu horizontal
  const rows = 4;
  const rh = 128 / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * rh;
    // Nat gelap
    ctx.fillStyle = '#54321c';
    ctx.fillRect(0, y, 256, 3);

    // Serat kayu halus
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(255, 230, 200, 0.08)';
      const sx = (i * 29) % 256;
      const sy = y + 4 + ((i * 13) % (rh - 8));
      ctx.fillRect(sx, sy, 35, 1.5);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 16);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSolarCellTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Biru gelap kristal monokristalin
  ctx.fillStyle = '#0f2747';
  ctx.fillRect(0, 0, 128, 128);

  // Grid garis busbar perak tipis
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 16; i < 128; i += 16) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
  }
  ctx.stroke();

  // Border sel perak
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 126, 126);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoofTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#99432d';
  ctx.fillRect(0, 0, 128, 128);

  for (let y = 0; y < 128; y += 14) {
    ctx.fillStyle = '#6e2c1b';
    ctx.fillRect(0, y, 128, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSpandekTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, 128, 128);

  for (let y = 0; y < 128; y += 8) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(0, y, 128, 2);
    ctx.fillStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.fillRect(0, y + 4, 128, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 10);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createAfterSignboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  // Background arang / charcoal modern
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 192);

  // Border aksen emas / warm wood
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 180);

  // Kaligrafi Arab
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 30px "Traditional Arabic", "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.fillText('مُصَلَّى الْمُهَاجِرِينَ', 256, 56);

  // Teks Latin MUSHOLLA AL MUHAJIRIN
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('MUSHOLLA AL MUHAJIRIN', 256, 114);

  // Subteks
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText('Teras Komunitas & Ramah Lansia  •  Jl. Bumi Bahagia, Bekasi', 256, 154);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createQrisTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 128, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('QRIS', 64, 17);

  // Pola kotak QR acak
  ctx.fillStyle = '#000000';
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if ((r + c * 3) % 2 === 0) {
        ctx.fillRect(24 + c * 11.5, 34 + r * 11.5, 9, 9);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ============================================================================
   2. SUBKOMPONEN HOLLOW SHELL & PROPERTI 5 FUNGSI
   ============================================================================ */

/**
 * Pintu Kaca Geser Bingkai Hitam (Bisa Diklik Geser Buka/Tutup!)
 * Menghubungkan langsung teras dek ke InteriorSpace.jsx
 */
function SlidingGlassDoor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isOpen = false,
  onToggle,
  isNight = false,
}) {
  const doorWidth = 2.2;
  const doorHeight = 2.3;
  const panelWidth = doorWidth / 2 - 0.04;
  const slideOffset = isOpen ? 0.88 : 0;

  return (
    <group position={position} rotation={rotation}>
      {/* Kusen Luar Aluminium Hitam Matte */}
      <mesh position={[0, doorHeight / 2, 0]}>
        <boxGeometry args={[doorWidth + 0.1, doorHeight + 0.08, 0.09]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Lubang Bukaan Pintu di Tengah Kusen */}
      {/* Daun Pintu Kiri (Bisa Geser ke Kiri saat Diklik) */}
      <group
        position={[-panelWidth / 2 - slideOffset, doorHeight / 2, 0.015]}
        onClick={(e) => {
          e.stopPropagation();
          onToggle && onToggle();
        }}
      >
        {/* Frame Daun Kaca */}
        <mesh>
          <boxGeometry args={[panelWidth, doorHeight - 0.06, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Kaca Bening Tinted Modern */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[panelWidth - 0.12, doorHeight - 0.16]} />
          <meshStandardMaterial
            color={isNight ? '#fde047' : '#94a3b8'}
            emissive={isNight ? '#fde047' : '#000000'}
            emissiveIntensity={isNight ? 0.35 : 0}
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Handle Vertikal Minimalis Hitam */}
        <mesh position={[panelWidth / 2 - 0.08, 0, 0.04]}>
          <cylinderGeometry args={[0.014, 0.014, 0.65, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Daun Pintu Kanan (Bisa Geser ke Kanan saat Diklik) */}
      <group
        position={[panelWidth / 2 + slideOffset, doorHeight / 2, -0.015]}
        onClick={(e) => {
          e.stopPropagation();
          onToggle && onToggle();
        }}
      >
        <mesh>
          <boxGeometry args={[panelWidth, doorHeight - 0.06, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[panelWidth - 0.12, doorHeight - 0.16]} />
          <meshStandardMaterial
            color={isNight ? '#fde047' : '#94a3b8'}
            emissive={isNight ? '#fde047' : '#000000'}
            emissiveIntensity={isNight ? 0.35 : 0}
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
        <mesh position={[-panelWidth / 2 + 0.08, 0, 0.04]}>
          <cylinderGeometry args={[0.014, 0.014, 0.65, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Indikator Text Bantu Klik Buka Pintu */}
      <mesh position={[0, 0.1, 0.12]}>
        <boxGeometry args={[0.34, 0.04, 0.01]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
    </group>
  );
}

/**
 * Terracotta Roster Wall (InstancedMesh Balok Terakota Berlubang)
 * Digunakan pada dinding kiri (-X = -6.32) untuk cross-ventilation alami
 */
function TerracottaRosterWall({
  position = [-6.32, 1.8, -2.75],
  rows = 8,
  cols = 20,
}) {
  const meshRef = useRef();
  const blockSize = 0.22;
  const gap = 0.04;
  const totalCount = rows * cols;

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const y = (r - rows / 2 + 0.5) * (blockSize + gap);
        const z = (c - cols / 2 + 0.5) * (blockSize + gap);

        dummy.position.set(0, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [rows, cols, blockSize, gap]);

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[null, null, totalCount]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.14, blockSize, blockSize]} />
        <meshStandardMaterial color="#c85633" roughness={0.82} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}

/**
 * Pot Tanaman Ramping Mepet Tembok (Planters)
 */
function SlimWallPlanters({ positions = [] }) {
  return (
    <group>
      {positions.map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          {/* Pot Kotak Minimalis Abu Gelap */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.44, 0.95]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Tanah */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.9]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
          {/* Tanaman Hijau Sansevieria / Lidah Mertua */}
          {[-0.32, -0.11, 0.11, 0.32].map((zp, j) => (
            <mesh key={j} position={[0, 0.72, zp]} rotation={[0.06 * (j - 1.5), 0, 0.04 * (j % 2 === 0 ? 1 : -1)]}>
              <boxGeometry args={[0.04, 0.62, 0.12]} />
              <meshStandardMaterial color="#22c55e" roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Ramp Landai Lansia & Handrail Stainless Steel
 */
function ElderlyRamp({ position = [3.9, 0, 5.2] }) {
  const rampLength = 2.4;
  const rampWidth = 1.35;
  const rampHeight = 0.36;
  const angle = Math.atan2(rampHeight, rampLength);

  return (
    <group position={position}>
      {/* Permukaan Dek Kayu Ramp Miring */}
      <mesh
        position={[0, rampHeight / 2, 0]}
        rotation={[-angle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[rampWidth, 0.08, rampLength]} />
        <meshStandardMaterial color="#8a532d" roughness={0.7} />
      </mesh>

      {/* Handrail Stainless Kiri & Kanan Ramp */}
      {[-rampWidth / 2 + 0.05, rampWidth / 2 - 0.05].map((xSide, i) => (
        <group key={i} position={[xSide, 0, 0]}>
          {/* Tiang Handrail Bawah, Tengah, Atas */}
          <mesh position={[0, 0.45, -rampLength / 2 + 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.45 + rampHeight / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.45 + rampHeight, rampLength / 2 - 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Rel Batang Pegangan Miring */}
          <mesh
            position={[0, 0.9 + rampHeight / 2, 0]}
            rotation={[-angle, 0, 0]}
          >
            <cylinderGeometry args={[0.024, 0.024, rampLength + 0.1, 8]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 1. ZONA PENDIDIKAN: Meja & Bangku Belajar, Laptop, Buku, & Tiang Colokan Listrik
 * Lokasi: X = 4.0..5.2, Z = -1.5..+1.5 (Dekat target kamera 'pendidikan')
 */
function EducationZone({ isNight = false }) {
  return (
    <group position={[4.6, 0.36, 0]} name="zona-pendidikan">
      {/* Meja Belajar Kayu Minimalis Panjang (1.8m x 0.75m) */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.05, 1.8]} />
        <meshStandardMaterial color="#a67244" roughness={0.65} />
      </mesh>
      {/* Kaki Meja Besi Hitam */}
      {[-0.32, 0.32].map((xK, i) =>
        [-0.82, 0.82].map((zK, j) => (
          <mesh key={`${i}-${j}`} position={[xK, 0.35, zK]}>
            <boxGeometry args={[0.04, 0.7, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* Bangku Kayu Panjang Kiri & Kanan Meja */}
      {[-0.55, 0.55].map((xB, i) => (
        <group key={i} position={[xB, 0, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.3, 0.04, 1.7]} />
            <meshStandardMaterial color="#8f5734" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.22, -0.75]}>
            <boxGeometry args={[0.04, 0.44, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0.75]}>
            <boxGeometry args={[0.04, 0.44, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Laptop Terbuka di Atas Meja 1 */}
      <group position={[-0.1, 0.75, -0.45]} rotation={[0, 0.15, 0]}>
        {/* Base Keyboard */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.26, 0.012, 0.36]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Layar Terbuka Menyala */}
        <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.008, 0.24, 0.36]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#38bdf8"
            emissiveIntensity={isNight ? 1.4 : 0.8}
          />
        </mesh>
      </group>

      {/* Laptop 2 di Atas Meja */}
      <group position={[0.1, 0.75, 0.45]} rotation={[0, -0.15, 0]}>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.26, 0.012, 0.36]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, 0.12, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.008, 0.24, 0.36]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#34d399"
            emissiveIntensity={isNight ? 1.4 : 0.8}
          />
        </mesh>
      </group>

      {/* Tumpukan Buku / Al-Quran Pelajar */}
      <group position={[0, 0.76, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.16]} />
          <meshStandardMaterial color="#047857" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.03, 0.15]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      </group>

      {/* Tiang Colokan Listrik / Charging Pedestal Mini */}
      <group position={[0.42, 0, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial
            color="#334155"
            emissive={isNight ? '#38bdf8' : '#000000'}
            emissiveIntensity={isNight ? 0.8 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 2. ZONA SOSIAL: Kulkas Berbagi Pangan Transparan
 * Lokasi: X = 3.5..4.5, Z = +1.8..+3.2 (Dekat target kamera 'sosial')
 */
function SocialZone({ isNight = false }) {
  return (
    <group position={[4.1, 0.36, 2.5]} name="zona-sosial-kulkas-berbagi">
      {/* Bodi Utama Kulkas Berbagi (Stainless Steel / Putih) */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.72, 1.8, 0.7]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Header Banner Kulkas "KULKAS BERBAGI" */}
      <mesh position={[0, 1.72, 0.36]}>
        <boxGeometry args={[0.68, 0.16, 0.02]} />
        <meshStandardMaterial
          color="#059669"
          emissive="#10b981"
          emissiveIntensity={isNight ? 0.9 : 0.4}
        />
      </mesh>

      {/* Pintu Kaca Bening Transparan Menghadap Depan/Kanan */}
      <mesh position={[0, 0.86, 0.36]}>
        <boxGeometry args={[0.66, 1.48, 0.02]} />
        <meshStandardMaterial
          color="#a7f3d0"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* Rak-Rak Kawat di Dalam Kulkas & Kotak Makanan Berbagi */}
      {[0.4, 0.78, 1.16].map((yShelf, idx) => (
        <group key={idx} position={[0, yShelf, 0.1]}>
          {/* Rak Kawat */}
          <mesh>
            <boxGeometry args={[0.62, 0.02, 0.5]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          {/* Kotak Nasi Berbagi / Bento Box */}
          {[-0.18, 0.18].map((xB, j) => (
            <mesh key={j} position={[xB, 0.05, 0]}>
              <boxGeometry args={[0.2, 0.07, 0.28]} />
              <meshStandardMaterial color={j % 2 === 0 ? '#f59e0b' : '#3b82f6'} roughness={0.5} />
            </mesh>
          ))}
          {/* Botol Air Mineral */}
          <mesh position={[0, 0.09, -0.1]}>
            <cylinderGeometry args={[0.035, 0.035, 0.16, 8]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Lampu Interior Kulkas Menyala (Sangat Jelas & Hangat saat Malam!) */}
      <pointLight
        position={[0, 1.2, 0.3]}
        color="#ecfdf5"
        intensity={isNight ? 3.5 : 1.2}
        distance={3.5}
      />
    </group>
  );
}

/**
 * 3. ZONA EKONOMI: 2 Gerobak Kayu UMKM Sarapan Warga + Stand QRIS
 * Lokasi: X = 4.2..5.5, Z = -8.5..-4.5 (Dekat target kamera 'ekonomi')
 */
function EconomyZone({ qrisTexture, isNight = false }) {
  return (
    <group position={[4.8, 0.36, -6.5]} name="zona-ekonomi-umkm">
      {/* --- GEROBAK 1: Nasi Uduk & Lontong Sayur (Z = -5.5) --- */}
      <group position={[0, 0, 1.3]}>
        {/* Meja Gerobak Kayu */}
        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[0.82, 0.72, 1.4]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
        {/* Etalase Kaca Makanan di Atas Gerobak */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.76, 0.36, 1.32]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.4}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        {/* Panci Dandang Stainless Lontong Sayur */}
        <mesh position={[0.1, 1.05, 0.35]}>
          <cylinderGeometry args={[0.16, 0.16, 0.3, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 4 Tiang Kanopi Gerobak */}
        {[-0.36, 0.36].map((xP, i) =>
          [-0.65, 0.65].map((zP, j) => (
            <mesh key={`${i}-${j}`} position={[xP, 1.42, zP]}>
              <boxGeometry args={[0.035, 1.1, 0.035]} />
              <meshStandardMaterial color="#713f12" />
            </mesh>
          ))
        )}
        {/* Kanopi Kain Strip Hijau-Putih */}
        <mesh position={[0, 1.98, 0]}>
          <boxGeometry args={[0.92, 0.06, 1.55]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>

        {/* Stand QRIS Mini di Atas Meja Gerobak */}
        <group position={[0.26, 0.94, -0.45]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.015, 0.16, 0.12]} />
            <meshStandardMaterial map={qrisTexture} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.14]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* 2 Roda Gerobak Kayu */}
        {[-0.7, 0.7].map((zW, i) => (
          <mesh key={i} position={[-0.42, 0.28, zW]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- GEROBAK 2: Sarapan Berkah & Gorengan Hangat (Z = -7.5) --- */}
      <group position={[0, 0, -1.3]}>
        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[0.82, 0.72, 1.4]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.76, 0.36, 1.32]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.4}
            roughness={0.2}
          />
        </mesh>
        {/* Nampan Stainless Makanan Gorengan */}
        {[-0.3, 0.3].map((zN, i) => (
          <mesh key={i} position={[0, 0.92, zN]}>
            <boxGeometry args={[0.55, 0.03, 0.42]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
          </mesh>
        ))}
        {/* Kanopi Kain Oranye-Kuning */}
        <mesh position={[0, 1.98, 0]}>
          <boxGeometry args={[0.92, 0.06, 1.55]} />
          <meshStandardMaterial color="#c2410c" roughness={0.7} />
        </mesh>
        {/* Stand QRIS Gerobak 2 */}
        <group position={[0.26, 0.94, 0.4]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.015, 0.16, 0.12]} />
            <meshStandardMaterial map={qrisTexture} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Kubah Perak & Finial Bulan Sabit
 */
function SilverDome({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.68, 0.78, 0.44, 14]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.76, 0]} castShadow>
        <sphereGeometry args={[0.74, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <meshStandardMaterial color="#e5ebf2" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <coneGeometry args={[0.18, 0.56, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.94, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.52, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 2.22, 0]} rotation={[0, 0, 0.35]}>
        <torusGeometry args={[0.12, 0.02, 8, 14, Math.PI * 1.45]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   3. KOMPONEN UTAMA: AFTER MUSHOLLA (HOLLOW SHELL & SINKRON DENAH 1:1)
   ============================================================================ */
export default function AfterMusholla({ isNight = false, timeOfDay }) {
  const night = Boolean(isNight) || timeOfDay === 'night' || timeOfDay === 'isya';

  // State interaktif 2 pintu geser
  const [door1Open, setDoor1Open] = useState(false);
  const [door2Open, setDoor2Open] = useState(false);

  const textures = useMemo(() => ({
    woodPlank: createWoodPlankTexture(),
    solarCell: createSolarCellTexture(),
    roofTile: createRoofTileTexture(),
    spandek: createSpandekTexture(),
    signboard: createAfterSignboardTexture(),
    qris: createQrisTexture(),
  }), []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  return (
    <group name="after-musholla">
      {/* =====================================================================
          A. EMPAT DINDING LUAR SOLID PERIMETER (FULL-HEIGHT 3.65m, TEBAL 0.20m)
          TIDAK ADA CELAH TEMBUS PANDANG DARI DALAM MAUPUN LUAR!
          Kavling Baku: X = -6.38 s/d +2.97 (lebar 9.35m), Z = -10.92 s/d +3.94 (panjang 14.86m)
          ===================================================================== */}
      <group name="solid-perimeter-walls">
        {/* --- 1. FASAD DEPAN SOLID (+Z = +3.94, TEBAL 0.20m, TINGGI 3.65m) ---
            Menutup 100% rapat di belakang Mihrab, Mimbar, dan Kaligrafi Allah & Muhammad */}
        {/* Segmen Kiri Depan (Menutup belakang Mihrab & Mimbar dari X = -6.38 s/d -2.60) */}
        <mesh position={[-4.49, 1.825, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[3.78, 3.65, 0.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Segmen Kanan Depan (Menutup belakang Kaligrafi Muhammad & Sholat Kanan dari X = -0.20 s/d +2.97) */}
        <mesh position={[1.385, 1.825, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[3.17, 3.65, 0.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Segmen Bawah Jendela Depan (X = -2.60 s/d -0.20, Y = 0 s/d 0.92) */}
        <mesh position={[-1.4, 0.46, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.92, 0.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Segmen Atas Jendela Depan (X = -2.60 s/d -0.20, Y = 2.24 s/d 3.65) */}
        <mesh position={[-1.4, 2.945, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.41, 0.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Kusen & Kaca Jendela Depan Minimalis (3 Panel dengan Mullion Ramping) */}
        <group position={[-1.4, 1.58, 3.95]}>
          {/* Bingkai Kusen Luar Hitam (Atas, Bawah, Kiri, Kanan) */}
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[2.38, 0.06, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <boxGeometry args={[2.38, 0.06, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[-1.16, 0, 0]}>
            <boxGeometry args={[0.06, 1.3, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[1.16, 0, 0]}>
            <boxGeometry args={[0.06, 1.3, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
          </mesh>
          {/* 2 Tiang Mullion Pembagi 3 Panel */}
          {[-0.38, 0.38].map((xM, idx) => (
            <mesh key={idx} position={[xM, 0, 0]}>
              <boxGeometry args={[0.045, 1.2, 0.06]} />
              <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
            </mesh>
          ))}
          {/* Kaca Reflektif Kebiruan (Hangat saat Malam) */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.26, 1.18]} />
            <meshStandardMaterial
              color={night ? '#fde68a' : '#7dd3fc'}
              emissive={night ? '#fbbf24' : '#38bdf8'}
              emissiveIntensity={night ? 0.55 : 0.12}
              roughness={0.15}
              metalness={0.45}
              transparent
              opacity={night ? 0.55 : 0.42}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Aksen Kisi Kayu Vertikal di Fasad Depan (+Z = 4.05) */}
        {[-4.2, -3.8, -3.4, -3.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4].map((xK, i) => (
          <mesh key={i} position={[xK, 1.825, 4.06]}>
            <boxGeometry args={[0.045, 3.6, 0.04]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
        ))}

        {/* Top Parapet Hitam Ramping Modern */}
        <mesh position={[-1.705, 3.71, 3.94]}>
          <boxGeometry args={[9.45, 0.12, 0.24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* --- 2. SISI KIRI SOLID & ROSTER BATA TERAKOTA (-X = -6.32, MEMANJANG Z = -10.92 s/d +3.94) --- */}
        {/* Segmen Depan Penuh dari Depan s/d Awal Roster (Z = -0.5 s/d +3.94, panjang 4.44m, Y = 0 s/d 3.65) */}
        <mesh position={[-6.32, 1.825, 1.72]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 4.44]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Segmen Belakang Penuh Menutup Area Wudhu & WC (Z = -4.5 s/d -10.92, panjang 6.42m, Y = 0 s/d 3.65) */}
        <mesh position={[-6.32, 1.825, -7.71]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 6.42]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Area Bukaan Roster Terakota (Z = -4.5 s/d -0.5, panjang 4.0m): */}
        {/* Dinding Bawah Roster (Y = 0 s/d 1.0) */}
        <mesh position={[-6.32, 0.5, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.0, 4.0]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        {/* Dinding Atas Roster (Y = 2.8 s/d 3.65) */}
        <mesh position={[-6.32, 3.225, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.85, 4.0]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Roster Bata Terakota Mengisi Bukaan Rapat (Y = 1.0 s/d 2.8, Z = -4.5 s/d -0.5) */}
        <TerracottaRosterWall position={[-6.32, 1.9, -2.5]} rows={7} cols={15} />

        {/* Pot Ramping Mepet Dinding Sepanjang Gang Kiri */}
        <SlimWallPlanters
          positions={[
            [-6.56, 0, 3.2],
            [-6.56, 0, 1.2],
            [-6.56, 0, -0.8],
            [-6.56, 0, -2.8],
            [-6.56, 0, -4.8],
            [-6.56, 0, -6.8],
            [-6.56, 0, -8.8],
          ]}
        />

        {/* --- 3. DINDING BELAKANG SOLID (Z = -10.92, TEBAL 0.20m, TINGGI 3.65m) --- */}
        <mesh position={[-1.705, 1.825, -10.92]} castShadow receiveShadow>
          <boxGeometry args={[9.35, 3.65, 0.2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
        </mesh>

        {/* --- 4. DINDING KANAN SOLID DENGAN BUKAAN PINTU GESER (X = +2.97) --- */}
        {/* Segmen Depan (Z = +1.30 s/d +3.94, panjang 2.64m) */}
        <mesh position={[2.97, 1.825, 2.62]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 2.64]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Di Atas Pintu Geser 1 (Z = 0.2, Y = 2.30 s/d 3.65, tinggi 1.35m) */}
        <mesh position={[2.97, 2.975, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.35, 2.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Segmen Tengah Antara Pintu 1 & 2 (Z = -5.40 s/d -0.90, panjang 4.50m) */}
        <mesh position={[2.97, 1.825, -3.15]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 4.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Di Atas Pintu Geser 2 (Z = -6.5, Y = 2.30 s/d 3.65, tinggi 1.35m) */}
        <mesh position={[2.97, 2.975, -6.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.35, 2.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        {/* Segmen Belakang (Z = -10.92 s/d -7.60, panjang 3.32m) */}
        <mesh position={[2.97, 1.825, -9.26]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 3.32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>

        {/* Panel Kisi Kayu Dekoratif di Sisi Luar Dinding Kanan (+X = 3.08) */}
        {[-5.0, -4.5, -4.0, -3.5, -3.0, -2.5, -2.0, -1.5, 1.8, 2.3, 2.8, 3.3].map((zS, idx) => (
          <mesh key={idx} position={[3.08, 1.825, zS]}>
            <boxGeometry args={[0.04, 3.65, 0.05]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
        ))}

        {/* 2 Pintu Kaca Geser Bingkai Hitam (Bisa Diklik Buka/Tutup!) */}
        {/* Pintu 1 (Depan, Z = 0.2, Selaras Pintu Utama Ruang Sholat) */}
        <SlidingGlassDoor
          position={[2.97, 0.36, 0.2]}
          rotation={[0, Math.PI / 2, 0]}
          isOpen={door1Open}
          onToggle={() => setDoor1Open((prev) => !prev)}
          isNight={night}
        />

        {/* Pintu 2 (Belakang, Z = -6.5, Selaras Pintu Area Sandal & Wudhu) */}
        <SlidingGlassDoor
          position={[2.97, 0.36, -6.5]}
          rotation={[0, Math.PI / 2, 0]}
          isOpen={door2Open}
          onToggle={() => setDoor2Open((prev) => !prev)}
          isNight={night}
        />

        {/* Papan Nama Modern "MUSHOLLA AL MUHAJIRIN" Backlight */}
        <group position={[3.06, 2.95, 3.2]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0, -0.02]} castShadow>
            <boxGeometry args={[2.2, 0.82, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[2.14, 0.76]} />
            <meshStandardMaterial
              map={textures.signboard}
              roughness={0.3}
              emissive={night ? '#fef08a' : '#000000'}
              emissiveIntensity={night ? 0.75 : 0}
            />
          </mesh>
          {night && (
            <pointLight position={[0, 0, 0.4]} intensity={2.2} distance={4.5} color="#fef08a" />
          )}
        </group>

        {/* Smart TV Digital Board Dinding Teras */}
        <SmartTV
          position={[3.08, 2.1, 2.0]}
          rotation={[0, Math.PI / 2, 0]}
          isNight={night}
        />
      </group>

      {/* =====================================================================
          B. TERAS DEK KAYU HANGAT & RAMP LANDAI LANSIA (X = +3.0 s/d +7.2)
          Menggantikan undakan batu alam sempit eksisting
          ===================================================================== */}
      <group name="teras-dek-kayu">
        {/* Lantai Dek Kayu Rata Luas (X = +3.0 s/d +7.2, Z = -11.0 s/d +4.0) */}
        <mesh position={[5.1, 0.18, -3.5]} receiveShadow>
          <boxGeometry args={[4.2, 0.36, 15.0]} />
          <meshStandardMaterial map={textures.woodPlank} roughness={0.6} />
        </mesh>

        {/* Lis Strip LED Bawah Dek Kayu Menyala Hangat saat Malam */}
        <mesh position={[5.1, 0.04, 4.02]}>
          <boxGeometry args={[4.2, 0.06, 0.04]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={night ? '#fef08a' : '#000000'}
            emissiveIntensity={night ? 1.4 : 0}
          />
        </mesh>
        <mesh position={[7.22, 0.04, -3.5]}>
          <boxGeometry args={[0.04, 0.06, 15.0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive={night ? '#fef08a' : '#000000'}
            emissiveIntensity={night ? 1.2 : 0}
          />
        </mesh>

        {/* Ramp Landai Lansia di Depan Teras Dek */}
        <ElderlyRamp position={[4.0, 0, 5.2]} />
      </group>

      {/* =====================================================================
          C. 3 ZONA PROPERTI UNGGULAN DI DALAM BATAS TIANG KANOPI (X <= 7.2)
          ===================================================================== */}
      {/* 1. Zona Pendidikan (Meja Belajar, Laptop, Buku, Colokan Listrik) */}
      <EducationZone isNight={night} />

      {/* 2. Zona Sosial (Kulkas Berbagi Pangan Transparan) */}
      <SocialZone isNight={night} />

      {/* 3. Zona Ekonomi (2 Gerobak UMKM Sarapan Warga + QRIS) */}
      <EconomyZone qrisTexture={textures.qris} isNight={night} />

      {/* =====================================================================
          D. ATAP GENTENG LIMASAN & KUBAH PERAK (TETAP DI TITIK PERSIS EKSISTING!)
          ===================================================================== */}
      <group position={[-1.7, 3.65, -3.5]}>
        {/* Tier 1 Atap Limasan */}
        <group scale={[1, 1, 1.48]}>
          <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[6.9, 2.5, 4]} />
            <meshStandardMaterial map={textures.roofTile} roughness={0.78} />
          </mesh>
        </group>

        {/* Tier 2 Tajug / Puncak Genteng */}
        <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.5, 1.35, 4]} />
          <meshStandardMaterial map={textures.roofTile} color="#a64c35" roughness={0.75} />
        </mesh>

        {/* Kubah Perak Kecil & Finial Bulan Sabit */}
        <SilverDome position={[0, 3.25, 0]} />
      </group>

      {/* =====================================================================
          E. KANOPI BAJA RINGAN DENGAN PANEL SURYA (SOLAR ROOF)
             Miring naik ke kanan persis Before (kiri Y=3.68, kanan Y=4.58)
          ===================================================================== */}
      <group position={[5.25, 4.14, -3.4]} rotation={[0, 0, 0.19]}>
        {/* Atap Spandek Zincalume */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.85, 0.055, 15.8]} />
          <meshStandardMaterial
            map={textures.spandek}
            color="#cbd5e1"
            roughness={0.45}
            metalness={0.55}
          />
        </mesh>

        {/* Kuda-Kuda Truss Rangka Baja Ringan */}
        {[-7.4, -4.4, -1.4, 1.6, 4.6, 7.4].map((zTruss, i) => (
          <group key={i} position={[0, -0.06, zTruss]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[4.75, 0.055, 0.055]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[4.75, 0.055, 0.055]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.35} />
            </mesh>
          </group>
        ))}

        {/* DERETAN PANEL SURYA (SOLAR ROOF) DI ATAS KANOPI */}
        {/* Grid 4 Kolom x 6 Baris Panel Surya Modern */}
        {[-1.6, -0.55, 0.55, 1.6].map((xSol, colIdx) =>
          [-6.2, -3.7, -1.2, 1.3, 3.8, 6.3].map((zSol, rowIdx) => (
            <group key={`${colIdx}-${rowIdx}`} position={[xSol, 0.16, zSol]}>
              {/* Bingkai Aluminium Panel */}
              <mesh>
                <boxGeometry args={[0.98, 0.03, 2.2]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Sel Fotovoltaik Monokristalin Biru Gelap Mengkilap */}
              <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.94, 2.14]} />
                <meshStandardMaterial
                  map={textures.solarCell}
                  roughness={0.15}
                  metalness={0.88}
                />
              </mesh>
            </group>
          ))
        )}

        {/* 4 Lampu Downlight Hangat di Bawah Kanopi (Menyala di Malam Hari) */}
        {[5.2, 1.6, -2.0, -5.6].map((zBulb, idx) => (
          <group key={idx} position={[-0.2, -0.22, zBulb]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial
                color={night ? '#fffbe6' : '#e2e8f0'}
                emissive={night ? '#ffe49e' : '#ffffff'}
                emissiveIntensity={night ? 3.0 : 0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2 PointLight Penerangan Malam di Bawah Kanopi */}
      {night && (
        <>
          <pointLight position={[5.0, 3.5, 1.2]} color="#ffdf9e" intensity={14} distance={16} decay={2} />
          <pointLight position={[5.0, 3.5, -6.2]} color="#ffdf9e" intensity={13} distance={16} decay={2} />
        </>
      )}

      {/* 5 Tiang Penyangga Kanopi di Pinggir Kanan (X = +7.38, Tetap di Titik Eksisting!) */}
      {[4.1, 0.4, -3.3, -7.0, -10.8].map((zCol, idx) => (
        <group key={idx} position={[7.38, 0, zCol]}>
          <mesh position={[0, 2.28, 0]} castShadow>
            <boxGeometry args={[0.11, 4.56, 0.11]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.24, 0.08, 0.24]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
