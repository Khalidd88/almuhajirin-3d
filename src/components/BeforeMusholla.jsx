import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/* ============================================================================
   1. PROCEDURAL TEXTURES RINGAN (MAX 256px, 60 FPS DI HP)
   ============================================================================ */

function createStoneMosaicTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Nat semen abu hangat
  ctx.fillStyle = '#756e67';
  ctx.fillRect(0, 0, 256, 128);

  // Palet batu alam tempel oranye-coklat-krem khas undakan Musholla Al Muhajirin
  const palette = ['#b8643b', '#9c5233', '#c9885b', '#7c6556', '#a8744f', '#8a4930', '#b89f86'];
  const rows = 4;
  const rh = 128 / rows;

  for (let r = 0; r < rows; r++) {
    let x = -((r * 19) % 28);
    while (x < 256) {
      const w = 24 + ((r * 37 + Math.abs(x) * 13) % 28);
      const color = palette[Math.abs(r * 7 + Math.floor(x / 17)) % palette.length];
      ctx.fillStyle = color;
      ctx.fillRect(x + 2, r * rh + 2, w - 4, rh - 4);

      ctx.fillStyle = 'rgba(255, 240, 220, 0.14)';
      ctx.fillRect(x + 3, r * rh + 3, w - 6, 4);
      x += w;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSpandekTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b6bfc6';
  ctx.fillRect(0, 0, 256, 128);

  for (let y = 0; y < 128; y += 8) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fillRect(0, y, 256, 2);
    ctx.fillStyle = 'rgba(55, 65, 75, 0.24)';
    ctx.fillRect(0, y + 4, 256, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 10);
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
    for (let x = 0; x < 128; x += 14) {
      ctx.fillStyle = 'rgba(255, 218, 192, 0.1)';
      ctx.fillRect(x + 2, y + 4, 6, 8);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createOldRosterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Panel roster beton krem 2 baris khas tembok belakang kiri Jl. Bumi Bahagia
  ctx.fillStyle = '#d9c5b2';
  ctx.fillRect(0, 0, 256, 128);

  const cols = 8;
  const rows = 4;
  const cw = 256 / cols;
  const ch = 128 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw;
      const y = r * ch;
      ctx.fillStyle = '#695749';
      ctx.fillRect(x + 5, y + 5, cw - 10, ch - 10);
      ctx.fillStyle = '#e6d5c4';
      ctx.fillRect(x + cw * 0.43, y + 4, cw * 0.14, ch - 8);
      ctx.fillRect(x + 4, y + ch * 0.43, cw - 8, ch * 0.14);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGreenVentBandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Band ventilasi hijau tua dengan lubang kotak silang di bawah kanopi (sesuai Street View!)
  ctx.fillStyle = '#15632e';
  ctx.fillRect(0, 0, 256, 64);

  for (let x = 10; x < 256; x += 32) {
    ctx.fillStyle = '#0c3619';
    ctx.fillRect(x, 14, 18, 36);
    ctx.strokeStyle = '#1e7a3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 14);
    ctx.lineTo(x + 18, 50);
    ctx.moveTo(x + 18, 14);
    ctx.lineTo(x, 50);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSignboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#edf5ef';
  ctx.fillRect(0, 0, 512, 256);

  ctx.lineWidth = 14;
  ctx.strokeStyle = '#146c35';
  ctx.strokeRect(7, 7, 498, 242);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#22a052';
  ctx.strokeRect(20, 20, 472, 216);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 34px serif';
  ctx.textAlign = 'center';
  ctx.fillText('مُصَلَّى الْمُهَاجِرِينَ', 256, 70);

  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillStyle = '#166534';
  ctx.fillText('MUSHOLLA', 256, 116);

  ctx.font = '900 44px Arial, sans-serif';
  ctx.fillStyle = '#0f3d20';
  ctx.fillText('AL MUHAJIRIN', 256, 172);

  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillStyle = '#166534';
  ctx.fillText('UJUNG HARAPAN JL. BUMI BAHAGIA', 256, 206);
  ctx.font = '12px Arial, sans-serif';
  ctx.fillText('RT.006 RW.014 BAHAGIA, BABELAN - BEKASI', 256, 226);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ============================================================================
   2. SUB-KOMPONEN ARSITEKTUR EKSISTING (ZERO ROTATION BUG)
   ============================================================================ */

function ArchFrame({ width = 1.6, scaleY = 1, depth = 0.08, thickness = 0.07, color = '#f8fafc' }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const rOuter = width / 2;
    const rInner = Math.max(0.02, rOuter - thickness);

    s.absarc(0, 0, rOuter, 0, Math.PI, false);
    s.lineTo(-rInner, 0);
    s.absarc(0, 0, rInner, Math.PI, 0, true);
    s.closePath();
    return s;
  }, [width, thickness]);

  const extrudeSettings = useMemo(() => ({ depth, bevelEnabled: false }), [depth]);

  return (
    <mesh position={[0, 0, -depth / 2]} scale={[1, scaleY, 1]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} roughness={0.35} />
    </mesh>
  );
}

/**
 * ArchedDoubleDoor: Pintu Ganda Lengkung Putih + 2 Kaca Samping Gelap (Persis Street View!)
 */
function ArchedDoubleDoor({ position = [0, 0, 0], rotation = [0, 0, 0], isNight = false }) {
  const totalW = 2.25;
  const doorW = 1.45;
  const sideW = (totalW - doorW) / 2;
  const rectH = 1.95;
  const archScaleY = 0.54;
  const archR = totalW / 2;

  const glassColor = isNight ? '#ffd58a' : '#243542';
  const glassEmissive = isNight ? '#ffb84d' : '#000000';
  const glassIntensity = isNight ? 1.25 : 0;

  return (
    <group position={position} rotation={rotation}>
      {/* Kusen Luar Kiri, Kanan, & Palang Transom */}
      <mesh position={[-totalW / 2, rectH / 2, 0.02]}>
        <boxGeometry args={[0.08, rectH, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[totalW / 2, rectH / 2, 0.02]}>
        <boxGeometry args={[0.08, rectH, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[0, rectH, 0.025]}>
        <boxGeometry args={[totalW + 0.08, 0.075, 0.09]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* Tiang Pemisah Daun Pintu & Kaca Samping */}
      <mesh position={[-doorW / 2, rectH / 2, 0.025]}>
        <boxGeometry args={[0.065, rectH, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[doorW / 2, rectH / 2, 0.025]}>
        <boxGeometry args={[0.065, rectH, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* Kaca Samping Gelap Kiri & Kanan */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (doorW / 2 + sideW / 2), rectH / 2, 0.015]}>
          <planeGeometry args={[sideW - 0.05, rectH - 0.06]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassEmissive}
            emissiveIntensity={glassIntensity}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Daun Pintu Putih Kiri & Kanan dengan Panel Moulding */}
      {[-1, 1].map((side) => {
        const cx = side * (doorW / 4);
        const leafW = doorW / 2 - 0.03;
        return (
          <group key={side} position={[cx, 0, 0.02]}>
            <mesh position={[0, rectH / 2, 0]}>
              <boxGeometry args={[leafW, rectH - 0.06, 0.04]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.56, 0.022]}>
              <boxGeometry args={[leafW - 0.14, 0.78, 0.015]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.45} />
            </mesh>
            <mesh position={[0, 1.42, 0.022]}>
              <boxGeometry args={[leafW - 0.14, 0.66, 0.015]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.45} />
            </mesh>
            {/* Handle Pintu Stainless */}
            <mesh position={[-side * (leafW / 2 - 0.08), 1.02, 0.05]}>
              <cylinderGeometry args={[0.013, 0.013, 0.3, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* Kaca Lengkung Atas (Fanlight) */}
      <group position={[0, rectH, 0.01]}>
        <mesh position={[0, 0, 0.005]} scale={[1, archScaleY, 1]}>
          <circleGeometry args={[archR - 0.03, 24, 0, Math.PI]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassEmissive}
            emissiveIntensity={glassIntensity}
            roughness={0.2}
          />
        </mesh>
        <ArchFrame width={totalW + 0.08} scaleY={archScaleY} depth={0.09} thickness={0.075} />
        {/* Jari-jari Lengkungan mengarah ke ATAS saja */}
        {[-0.88, -0.44, 0, 0.44, 0.88].map((ang, i) => (
          <group key={i} scale={[1, archScaleY, 1]} rotation={[0, 0, ang]}>
            <mesh position={[0, (archR - 0.04) / 2, 0.02]}>
              <boxGeometry args={[0.026, archR - 0.04, 0.03]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * Arched3PanelWindow: Jendela 3 Panel dengan 1 Lengkungan Lebar
 */
function Arched3PanelWindow({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.0,
  height = 1.25,
  isNight = false,
}) {
  const archScaleY = 0.56;
  const archR = width / 2;
  const panelW = width / 3;

  const glassColor = isNight ? '#ffd58a' : '#243542';
  const glassEmissive = isNight ? '#ffb84d' : '#000000';
  const glassIntensity = isNight ? 1.25 : 0;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0.01]}>
        <planeGeometry args={[width - 0.04, height - 0.04]} />
        <meshStandardMaterial
          color={glassColor}
          emissive={glassEmissive}
          emissiveIntensity={glassIntensity}
          roughness={0.2}
        />
      </mesh>

      {/* Bingkai Luar */}
      <mesh position={[-width / 2, height / 2, 0.02]}>
        <boxGeometry args={[0.075, height + 0.04, 0.085]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0.02]}>
        <boxGeometry args={[0.075, height + 0.04, 0.085]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width + 0.08, 0.075, 0.095]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      <mesh position={[0, height, 0.025]}>
        <boxGeometry args={[width + 0.06, 0.065, 0.085]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* 2 Tiang Vertikal Pembagi 3 Panel */}
      {[-panelW / 2, panelW / 2].map((xDiv, i) => (
        <mesh key={i} position={[xDiv, height / 2, 0.025]}>
          <boxGeometry args={[0.055, height, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, height * 0.52, 0.022]}>
        <boxGeometry args={[width - 0.04, 0.032, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* Lengkungan Atas */}
      <group position={[0, height, 0.01]}>
        <mesh position={[0, 0, 0.005]} scale={[1, archScaleY, 1]}>
          <circleGeometry args={[archR - 0.03, 24, 0, Math.PI]} />
          <meshStandardMaterial
            color={glassColor}
            emissive={glassEmissive}
            emissiveIntensity={glassIntensity}
            roughness={0.2}
          />
        </mesh>
        <ArchFrame width={width + 0.07} scaleY={archScaleY} depth={0.085} thickness={0.07} />
        {[-panelW / 2, panelW / 2].map((xDiv, i) => {
          const archHAtX = Math.sqrt(Math.max(0.01, archR * archR - xDiv * xDiv)) * archScaleY;
          return (
            <mesh key={i} position={[xDiv, archHAtX / 2, 0.02]}>
              <boxGeometry args={[0.045, archHAtX, 0.05]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function OutdoorAC({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.5, 0.28]} />
        <meshStandardMaterial color="#e2e5e8" roughness={0.45} />
      </mesh>
      <mesh position={[0.08, 0, 0.145]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.015, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.65} />
      </mesh>
      <mesh position={[-0.24, -0.28, -0.05]}>
        <boxGeometry args={[0.035, 0.15, 0.22]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.24, -0.28, -0.05]}>
        <boxGeometry args={[0.035, 0.15, 0.22]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function MaroonFence({ width = 4.0, height = 1.5, position = [0, 0, 0], rotation = [0, 0, 0], withDiagonal = false }) {
  const barCount = Math.max(4, Math.floor(width / 0.16));
  const bars = useMemo(() => Array.from({ length: barCount }, (_, i) => i), [barCount]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[width, 0.045, 0.045]} />
        <meshStandardMaterial color="#7d2224" roughness={0.45} metalness={0.45} />
      </mesh>
      <mesh position={[0, height - 0.22, 0]}>
        <boxGeometry args={[width, 0.045, 0.045]} />
        <meshStandardMaterial color="#7d2224" roughness={0.45} metalness={0.45} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#7d2224" roughness={0.45} metalness={0.45} />
      </mesh>

      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.065, height + 0.06, 0.065]} />
        <meshStandardMaterial color="#681a1c" roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.065, height + 0.06, 0.065]} />
        <meshStandardMaterial color="#681a1c" roughness={0.45} metalness={0.5} />
      </mesh>

      {bars.map((i) => {
        const xPos = -width / 2 + (i + 0.5) * (width / barCount);
        return (
          <mesh key={i} position={[xPos, height / 2, 0]}>
            <boxGeometry args={[0.02, height - 0.08, 0.02]} />
            <meshStandardMaterial color="#842628" roughness={0.45} metalness={0.45} />
          </mesh>
        );
      })}

      {withDiagonal && (
        <mesh position={[0, height / 2, 0.02]} rotation={[0, 0, Math.atan2(height, width)]}>
          <boxGeometry args={[Math.hypot(width, height) * 0.92, 0.045, 0.03]} />
          <meshStandardMaterial color="#7d2224" roughness={0.45} metalness={0.5} />
        </mesh>
      )}
    </group>
  );
}

function SmallWallPot({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.13, 0.095, 0.26, 8]} />
        <meshLambertMaterial color="#6b3e2e" />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshLambertMaterial color="#3c732a" />
      </mesh>
    </group>
  );
}

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
   3. KOMPONEN UTAMA: BEFORE MUSHOLLA (1:1 SKALA NYATA GOOGLE EARTH 14m x 20m)
   Koordinat Baku sinkron penuh dengan Neighborhood.jsx:
   - Musholla Utama: X = -6.38 s/d +3.0 (lebar 9.38m), Z = -11.0 s/d +4.0 (panjang 15.0m)
   - Gang Jl. Bumi Bahagia (Kiri): X = -10.5 s/d -6.5 (pot mepet dinding di X = -6.52)
   - Gang Tembus Kanopi (Kanan): X = +3.0 s/d +7.5 (lebar 4.5m)
   ============================================================================ */

export default function BeforeMusholla({ isNight = false, timeOfDay }) {
  const night = Boolean(isNight) || timeOfDay === 'night' || timeOfDay === 'isya';

  const textures = useMemo(() => ({
    stone: createStoneMosaicTexture(),
    spandek: createSpandekTexture(),
    roofTile: createRoofTileTexture(),
    oldRoster: createOldRosterTexture(),
    ventBand: createGreenVentBandTexture(),
    signboard: createSignboardTexture(),
  }), []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  return (
    <group name="before-musholla">
      {/* =====================================================================
          A. EMPAT DINDING LUAR SOLID PERIMETER (FULL-HEIGHT 3.65m, TEBAL 0.20m)
          TIDAK ADA CELAH TEMBUS PANDANG DARI DALAM MAUPUN LUAR!
          Kavling Baku: X = -6.38 s/d +2.97 (lebar 9.35m), Z = -10.92 s/d +3.94 (panjang 14.86m)
          ===================================================================== */}
      <group name="solid-perimeter-walls">
        {/* --- 1. DINDING DEPAN SOLID (Z = +3.94, TEBAL 0.20m, TINGGI 3.65m) ---
            Menutup 100% rapat di belakang Mihrab, Mimbar, dan Kaligrafi Allah & Muhammad */}
        {/* Segmen Kiri Depan (Menutup belakang Mihrab & Mimbar dari X = -6.38 s/d -2.60) */}
        <mesh position={[-4.49, 1.825, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[3.78, 3.65, 0.2]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>
        {/* Segmen Kanan Depan (Menutup belakang Kaligrafi Muhammad & Sholat Kanan dari X = -0.20 s/d +2.97) */}
        <mesh position={[1.385, 1.825, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[3.17, 3.65, 0.2]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>
        {/* Segmen Bawah Jendela Depan (X = -2.60 s/d -0.20, Y = 0 s/d 0.92) */}
        <mesh position={[-1.4, 0.46, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.92, 0.2]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>
        {/* Segmen Atas Jendela Depan (X = -2.60 s/d -0.20, Y = 2.24 s/d 3.65) */}
        <mesh position={[-1.4, 2.945, 3.94]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.41, 0.2]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>

        {/* --- 2. DINDING KIRI SOLID (X = -6.32, MEMANJANG DARI Z = -10.92 s/d +3.94) ---
            Tutup solid penuh Y = 0 sampai Y = 3.65 agar pohon pisang & langit tidak tembus wudhu! */}
        <mesh position={[-6.32, 1.825, -3.49]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 14.86]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>

        {/* --- 3. DINDING BELAKANG SOLID (Z = -10.92, TEBAL 0.20m, TINGGI 3.65m) --- */}
        <mesh position={[-1.705, 1.825, -10.92]} castShadow receiveShadow>
          <boxGeometry args={[9.35, 3.65, 0.2]} />
          <meshStandardMaterial color="#dfb99d" roughness={0.75} />
        </mesh>

        {/* --- 4. DINDING KANAN HIJAU DENGAN BUKAAN PINTU & JENDELA (X = +2.97) --- */}
        {/* Segmen Depan (Z = +1.1 s/d +3.94) */}
        <mesh position={[2.97, 1.825, 2.52]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 2.84]} />
          <meshStandardMaterial color="#1d8f40" roughness={0.55} />
        </mesh>
        {/* Di atas Pintu 1 (Z = 0.2) */}
        <mesh position={[2.97, 2.925, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.45, 1.8]} />
          <meshStandardMaterial color="#1d8f40" roughness={0.55} />
        </mesh>
        {/* Segmen Tengah Antara Pintu 1 & 2 (Z = -0.7 s/d -5.6) */}
        <mesh position={[2.97, 1.825, -3.15]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 4.9]} />
          <meshStandardMaterial color="#1d8f40" roughness={0.55} />
        </mesh>
        {/* Di atas Pintu 2 (Z = -6.5) */}
        <mesh position={[2.97, 2.925, -6.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.45, 1.8]} />
          <meshStandardMaterial color="#1d8f40" roughness={0.55} />
        </mesh>
        {/* Segmen Belakang (Z = -7.4 s/d -10.92) */}
        <mesh position={[2.97, 1.825, -9.16]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.65, 3.52]} />
          <meshStandardMaterial color="#1d8f40" roughness={0.55} />
        </mesh>
      </group>

      {/* Plinth / Lis Bawah Coklat Bata di Sisi Depan & Kiri */}
      <mesh position={[-1.73, 0.17, -3.5]}>
        <boxGeometry args={[9.36, 0.34, 15.06]} />
        <meshStandardMaterial color="#9e5a44" roughness={0.85} />
      </mesh>

      {/* Lisplang / Parapet Menonjol di Bagian Depan Krem (Z: -0.5 s/d +4.12) */}
      <group position={[-1.7, 3.4, 1.82]}>
        <mesh castShadow>
          <boxGeometry args={[9.52, 0.58, 4.65]} />
          <meshStandardMaterial color="#e8cbb5" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[9.6, 0.055, 4.72]} />
          <meshStandardMaterial color="#9c6a4e" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[9.6, 0.055, 4.72]} />
          <meshStandardMaterial color="#9c6a4e" roughness={0.7} />
        </mesh>
      </group>

      {/* Tembok Samping Kiri Bagian Belakang (Lebih Tinggi + 2 Baris Roster Krem Lama!) */}
      <group position={[-6.32, 3.85, -5.75]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 1.15, 10.45]} />
          <meshStandardMaterial color="#dec0a6" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.34, 0.08, 10.55]} />
          <meshStandardMaterial color="#b07c5e" roughness={0.7} />
        </mesh>
        {/* Panel Roster Beton Krem Menghadap Jl. Bumi Bahagia (-X) */}
        <mesh position={[-0.14, 0.02, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[9.8, 0.8]} />
          <meshStandardMaterial map={textures.oldRoster} roughness={0.85} />
        </mesh>
      </group>

      {/* =====================================================================
          B. FASAD DEPAN KREM (Z = +4.0, MENGHADAP JALAN DEPAN +Z)
          ===================================================================== */}
      {/* Ceruk / Pintu Lorong Kecil Gelap di Sisi Kiri Fasad Depan */}
      <mesh position={[-5.35, 1.18, 4.02]}>
        <boxGeometry args={[0.92, 2.08, 0.06]} />
        <meshStandardMaterial color="#2b211b" roughness={0.85} />
      </mesh>

      {/* Jendela Lengkung 3-Panel Putih di Dinding Depan Krem */}
      <Arched3PanelWindow
        position={[-1.4, 0.92, 4.02]}
        width={2.35}
        height={1.32}
        isNight={night}
      />

      {/* Outdoor AC 1 (Di Dinding Depan Atas Kiri Jendela) */}
      <OutdoorAC position={[-4.2, 2.75, 4.18]} />

      {/* Teras Rendah Depan Blok Krem */}
      <mesh position={[-1.7, 0.075, 4.4]} receiveShadow>
        <boxGeometry args={[9.42, 0.15, 0.82]} />
        <meshStandardMaterial color="#c4b2a1" roughness={0.85} />
      </mesh>

      {/* Pagar Besi Merah Marun Membentuk L di Depan Dinding Krem */}
      <MaroonFence position={[-0.85, 0.15, 4.78]} width={7.75} height={1.52} />
      <MaroonFence
        position={[3.02, 0.15, 4.39]}
        rotation={[0, Math.PI / 2, 0]}
        width={0.8}
        height={1.52}
      />

      {/* Deretan Pot Tanaman Kecil Mepet Dinding Kiri Sepanjang Jl. Bumi Bahagia (X = -6.5) */}
      {[-9.8, -8.3, -6.8, -5.3, -3.8, -2.3, -0.8, 0.7, 2.2].map((zPot, idx) => (
        <SmallWallPot key={idx} position={[-6.5, 0, zPot]} scale={0.82 + (idx % 3) * 0.1} />
      ))}

      {/* =====================================================================
          C. FASAD SAMPING KANAN HIJAU (X = +3.0, MEMANJANG 15m HADAP GANG KANAN)
          ===================================================================== */}

      {/* Band Ventilasi Kotak Hijau Tua di Bagian Atas Dinding Hijau */}
      <mesh position={[3.06, 3.46, -3.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[15.02, 0.36]} />
        <meshStandardMaterial map={textures.ventBand} roughness={0.6} />
      </mesh>

      {/* Undakan Lantai Batu Alam Tempel Sepanjang 15m Dinding Hijau */}
      <mesh position={[3.38, 0.18, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.36, 15.04]} />
        <meshStandardMaterial map={textures.stone} roughness={0.85} />
      </mesh>
      <mesh position={[3.38, 0.37, -3.5]} receiveShadow>
        <boxGeometry args={[0.7, 0.03, 15.06]} />
        <meshStandardMaterial color="#a88b73" roughness={0.5} />
      </mesh>

      {/* Papan Nama "MUSHOLLA AL MUHAJIRIN" di Pojok Depan Dinding Hijau */}
      <group position={[3.08, 2.68, 2.85]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.65, 0.88, 0.05]} />
          <meshStandardMaterial color="#14532d" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.56, 0.8]} />
          <meshStandardMaterial
            map={textures.signboard}
            roughness={0.4}
            emissive={night ? '#d1fae5' : '#000000'}
            emissiveIntensity={night ? 0.25 : 0}
          />
        </mesh>
      </group>

      {/* Pintu Ganda Lengkung Putih 1 (Depan) */}
      <ArchedDoubleDoor
        position={[3.06, 0.38, 0.2]}
        rotation={[0, Math.PI / 2, 0]}
        isNight={night}
      />

      {/* Outdoor AC 2 (Di antara Pintu 1 & Jendela Tengah) */}
      <OutdoorAC position={[3.2, 2.95, -1.6]} rotation={[0, Math.PI / 2, 0]} />

      {/* Jendela Lengkung 3-Panel Tengah */}
      <Arched3PanelWindow
        position={[3.06, 1.1, -3.2]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.3}
        height={1.25}
        isNight={night}
      />

      {/* Pintu Ganda Lengkung Putih 2 (Belakang) */}
      <ArchedDoubleDoor
        position={[3.06, 0.38, -6.5]}
        rotation={[0, Math.PI / 2, 0]}
        isNight={night}
      />

      {/* Jendela Belakang Kecil & Pilar Hijau Ujung Belakang + Pot Rimbun */}
      <Arched3PanelWindow
        position={[3.06, 1.1, -9.2]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.6}
        height={1.15}
        isNight={night}
      />
      <mesh position={[3.24, 1.15, -10.85]} castShadow>
        <boxGeometry args={[0.4, 2.3, 0.38]} />
        <meshStandardMaterial color="#187a36" roughness={0.6} />
      </mesh>
      <SmallWallPot position={[3.72, 0, -10.2]} scale={1.45} />
      <SmallWallPot position={[3.68, 0, -10.8]} scale={1.3} />

      {/* =====================================================================
          D. ATAP GENTENG LIMASAN BESAR (SESUAI GOOGLE EARTH!) & KUBAH PERAK
          Rotation 45° ditaruh di <mesh>, bukan geometry!
          ===================================================================== */}
      <group position={[-1.7, 3.65, -3.5]}>
        {/* Atap Genteng Limasan Utama (Tier 1) */}
        <group scale={[1, 1, 1.48]}>
          <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[6.9, 2.5, 4]} />
            <meshStandardMaterial map={textures.roofTile} roughness={0.78} />
          </mesh>
        </group>

        {/* Puncak Tajug / Limasan Atas (Tier 2 - terlihat bertingkat di Google Earth!) */}
        <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.5, 1.35, 4]} />
          <meshStandardMaterial map={textures.roofTile} color="#a64c35" roughness={0.75} />
        </mesh>

        {/* Kubah Perak Kecil di Puncak */}
        <SilverDome position={[0, 3.25, 0]} />
      </group>

      {/* =====================================================================
          E. KANOPI BAJA RINGAN MENAUNGI GANG KANAN (X: +3.0 s/d +7.5, Z: -11.2 s/d +4.4)
          Miring NAIK ke kanan: kiri nempel dinding hijau (Y ~ 3.68), kanan tinggi (Y ~ 4.58)
          ===================================================================== */}
      <group position={[5.25, 4.14, -3.4]} rotation={[0, 0, 0.19]}>
        {/* Lembaran Atap Spandek Baja Ringan */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.85, 0.055, 15.8]} />
          <meshStandardMaterial
            map={textures.spandek}
            color="#c4cdd4"
            roughness={0.48}
            metalness={0.55}
          />
        </mesh>

        {/* 6 Kuda-Kuda Truss Baja Ringan Melintang */}
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
            {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((xD, j) => (
              <mesh
                key={j}
                position={[xD, -0.035, 0]}
                rotation={[0, 0, j % 2 === 0 ? 0.65 : -0.65]}
              >
                <boxGeometry args={[0.03, 0.29, 0.03]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.35} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Gording Memanjang Sepanjang 15.8m Kanopi */}
        {[-2.15, -0.72, 0.72, 2.15].map((xPur, i) => (
          <mesh key={i} position={[xPur, 0.04, 0]}>
            <boxGeometry args={[0.05, 0.05, 15.7]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.35} />
          </mesh>
        ))}

        {/* 4 Lampu Gantung Bawah Kanopi (Menyala Terang saat Mode Malam!) */}
        {[5.2, 1.6, -2.0, -5.6].map((zBulb, idx) => (
          <group key={idx} position={[-0.3, -0.26, zBulb]}>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.26, 4]} />
              <meshLambertMaterial color="#1f2937" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial
                color={night ? '#fffbe6' : '#e2e8f0'}
                emissive={night ? '#ffe49e' : '#000000'}
                emissiveIntensity={night ? 3.5 : 0}
              />
            </mesh>
            {night && (
              <mesh>
                <sphereGeometry args={[0.26, 8, 8]} />
                <meshBasicMaterial
                  color="#ffe49e"
                  transparent
                  opacity={0.22}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}
          </group>
        ))}

        {/* Speaker Hitam Gantung di Bawah Kanopi */}
        <mesh position={[-1.4, -0.36, -1.8]} rotation={[0.15, 0.3, 0]}>
          <boxGeometry args={[0.28, 0.38, 0.26]} />
          <meshLambertMaterial color="#18181b" />
        </mesh>
      </group>

      {/* 2 PointLight Non-Shadow di Bawah Kanopi (Penerangan Malam Realistis & Ringan) */}
      {night && (
        <>
          <pointLight position={[4.9, 3.6, 1.2]} color="#ffdf9e" intensity={13} distance={15} decay={2} />
          <pointLight position={[4.9, 3.6, -6.2]} color="#ffdf9e" intensity={12} distance={15} decay={2} />
        </>
      )}

      {/* 5 Tiang Penyangga Kanopi di Pinggir Kanan Gang (X = +7.38) */}
      {[4.1, 0.4, -3.3, -7.0, -10.8].map((zCol, idx) => (
        <group key={idx} position={[7.38, 0, zCol]}>
          <mesh position={[0, 2.28, 0]} castShadow>
            <boxGeometry args={[0.11, 4.56, 0.11]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.24, 0.08, 0.24]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* =====================================================================
          F. GERBANG BESI MERAH MARUN KANAN (TERBUKA MELIPAT DI SISI KANAN GANG)
          ===================================================================== */}
      <MaroonFence
        position={[7.22, 0, 3.65]}
        rotation={[0, Math.PI / 2 - 0.14, 0]}
        width={1.9}
        height={1.76}
        withDiagonal={true}
      />
    </group>
  );
}