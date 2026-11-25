import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================================
   1. PROCEDURAL TEXTURES INTERIOR (KERAMIK, SAJADAH SHAF, JAM LED, KALIGRAFI)
   ============================================================================ */

function createCeramicTileTexture(baseColor = '#eceae4', groutColor = '#c4bfb6', repeatX = 10, repeatY = 12) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 400; i++) {
    const x = (i * 47) % 128;
    const y = (i * 89) % 128;
    ctx.fillStyle = 'rgba(0,0,0,0.025)';
    ctx.fillRect(x, y, 3, 2);
  }

  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, 125, 125);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPrayerCarpetTexture(isAfter = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isAfter ? '#24523e' : '#166534';
  ctx.fillRect(0, 0, 256, 256);

  // Garis pemisah shaf emas/krem
  ctx.fillStyle = isAfter ? '#e6d5b8' : '#d4af37';
  ctx.fillRect(0, 8, 256, 7);
  ctx.fillRect(0, 240, 256, 5);

  // Motif lengkung sajadah (2 jamaah per tile)
  ctx.strokeStyle = isAfter ? 'rgba(235, 224, 200, 0.45)' : 'rgba(230, 200, 95, 0.5)';
  ctx.lineWidth = 3;
  [64, 192].forEach((cx) => {
    ctx.beginPath();
    ctx.moveTo(cx - 52, 232);
    ctx.lineTo(cx - 52, 76);
    ctx.quadraticCurveTo(cx, 24, cx + 52, 76);
    ctx.lineTo(cx + 52, 232);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 42, 224);
    ctx.lineTo(cx - 42, 82);
    ctx.quadraticCurveTo(cx, 38, cx + 42, 82);
    ctx.lineTo(cx + 42, 224);
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDigitalPrayerClockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#090d12';
  ctx.fillRect(0, 0, 512, 192);

  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 184);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MUSHOLLA AL MUHAJIRIN  •  BEKASI', 256, 32);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 46px monospace';
  ctx.fillText('18:04:22', 138, 92);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('MAGHRIB  -00:08', 368, 86);

  const times = [
    { name: 'SUBUH', val: '04:12' },
    { name: 'DZUHUR', val: '11:44' },
    { name: 'ASHAR', val: '15:08' },
    { name: 'MAGHRIB', val: '17:56' },
    { name: 'ISYA', val: '19:10' },
  ];
  times.forEach((t, i) => {
    const x = 52 + i * 102;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 42, 118, 84, 56);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText(t.name, x, 137);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(t.val, x, 164);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCalligraphyPlaqueTexture(arabicText = 'اللّٰه', isAfter = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isAfter ? '#1c3b2e' : '#14532d';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 236, 236);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, 208, 208);

  ctx.fillStyle = '#f5d77f';
  ctx.font = 'bold 104px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(arabicText, 128, 134);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ============================================================================
   2. SUB-KOMPONEN DETAIL INTERIOR
   ============================================================================ */

function CeilingFan({ position = [0, 0, 0] }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * 3.2;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <group ref={bladesRef} position={[0, -0.46, 0]}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, i) => (
          <group key={i} rotation={[0, ang, 0]}>
            <mesh position={[0.38, 0, 0]} rotation={[0.12, 0, 0]}>
              <boxGeometry args={[0.62, 0.015, 0.13]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function WudhuFaucet({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, -0.35, 0.04]}>
        <cylinderGeometry args={[0.016, 0.016, 0.72, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.08, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.04, 0.18]}>
        <cylinderGeometry args={[0.013, 0.012, 0.08, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, 0.12]}>
        <boxGeometry args={[0.07, 0.018, 0.02]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} />
      </mesh>
    </group>
  );
}

function WoodenMimbar({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.72, 0.16, 0.65]} />
        <meshStandardMaterial color="#6e472b" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.65, 0.24]} castShadow>
        <boxGeometry args={[0.68, 1.05, 0.06]} />
        <meshStandardMaterial color="#7d5132" roughness={0.6} />
      </mesh>
      <mesh position={[-0.32, 0.56, 0]} castShadow>
        <boxGeometry args={[0.05, 0.88, 0.54]} />
        <meshStandardMaterial color="#6e472b" roughness={0.65} />
      </mesh>
      <mesh position={[0.32, 0.56, 0]} castShadow>
        <boxGeometry args={[0.05, 0.88, 0.54]} />
        <meshStandardMaterial color="#6e472b" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.18, 0.16]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.74, 0.05, 0.42]} />
        <meshStandardMaterial color="#8c5a37" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.72, 0.275]}>
        <boxGeometry args={[0.42, 0.52, 0.015]} />
        <meshStandardMaterial color="#b58d3d" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

function QuranShelf({ position = [0, 0, 0], rotationY = 0 }) {
  const bookColors = ['#14532d', '#1e3a8a', '#7f1d1d', '#78350f', '#065f46', '#1e40af'];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.72, -0.14]} castShadow>
        <boxGeometry args={[1.35, 1.44, 0.04]} />
        <meshStandardMaterial color="#7a5134" roughness={0.7} />
      </mesh>
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0]}>
          <boxGeometry args={[0.05, 1.44, 0.32]} />
          <meshStandardMaterial color="#7a5134" roughness={0.7} />
        </mesh>
      ))}
      {[0.05, 0.48, 0.92, 1.42].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.35, 0.04, 0.32]} />
          <meshStandardMaterial color="#8c5e3c" roughness={0.65} />
        </mesh>
      ))}
      {[0.58, 1.02].map((yShelf, sIdx) =>
        Array.from({ length: 10 }, (_, bIdx) => (
          <mesh key={`${sIdx}-${bIdx}`} position={[-0.5 + bIdx * 0.11, yShelf, 0.02]}>
            <boxGeometry args={[0.045, 0.22, 0.18]} />
            <meshLambertMaterial color={bookColors[(sIdx * 3 + bIdx) % bookColors.length]} />
          </mesh>
        ))
      )}
      {[-0.35, 0, 0.35].map((xM, i) => (
        <mesh key={i} position={[xM, 0.18, 0.02]}>
          <boxGeometry args={[0.28, 0.16, 0.22]} />
          <meshLambertMaterial color={i === 1 ? '#f1f5f9' : '#f8fafc'} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Kotak Amal / Infaq (Before: Kayu Klasik | After: Kayu Modern + Stand QRIS)
 */
function DonationBox({ position = [0, 0, 0], isAfter = false }) {
  return (
    <group position={position}>
      {/* Badan Kotak Amal */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.36, 0.68, 0.32]} />
        <meshStandardMaterial color={isAfter ? '#855836' : '#14532d'} roughness={0.55} />
      </mesh>
      {/* Lubang Uang Atas */}
      <mesh position={[0, 0.685, 0]}>
        <boxGeometry args={[0.16, 0.01, 0.025]} />
        <meshStandardMaterial color="#090d12" />
      </mesh>
      {/* Stand Akrilik QRIS di Mode After */}
      {isAfter && (
        <group position={[0, 0.8, -0.06]} rotation={[-0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.24, 0.015]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.01, 0.01]}>
            <planeGeometry args={[0.13, 0.13]} />
            <meshStandardMaterial color="#111827" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/**
 * Speaker Dinding Interior
 */
function WallSpeaker({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.24, 0.36, 0.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[0.2, 0.31]} />
        <meshStandardMaterial color="#27272a" roughness={0.85} />
      </mesh>
    </group>
  );
}

function SandalPair({ position = [0, 0, 0], rotationY = 0, color = '#1e293b' }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[-0.07, 0.02, 0]}>
        <boxGeometry args={[0.1, 0.03, 0.24]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0.07, 0.02, 0.01]}>
        <boxGeometry args={[0.1, 0.03, 0.24]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   3. KOMPONEN UTAMA: INTERIOR SPACE (FIXED & UPGRADED — EXACT DENAH CORETAN)
   Koordinat Interior (sinkron penuh dengan BeforeMusholla & AfterMusholla):
   - X: -6.25 (dinding kiri / Jl. Bumi Bahagia) s/d +2.88 (dinding kanan / 2 pintu)
   - Z: +3.88 (dinding depan / Kiblat) s/d -10.85 (dinding belakang)
   - Lantai utama: Y = 0.36 | Lantai basah Wudhu & WC: Y = 0.26 | Plafon: Y = 3.52
   ============================================================================ */

export default function InteriorSpace({ mode = 'before', isNight = false, timeOfDay }) {
  const isAfter = mode === 'after';
  const night = Boolean(isNight) || timeOfDay === 'night' || timeOfDay === 'isya';

  const textures = useMemo(() => ({
    mainFloor: createCeramicTileTexture(isAfter ? '#f2ede4' : '#e6e4de', '#c7c2b8', 11, 16),
    wetFloor: createCeramicTileTexture(isAfter ? '#d4d8d4' : '#c6d1d4', '#8e9a9e', 6, 12),
    wetWall: createCeramicTileTexture('#e2ecee', '#b4c6cb', 8, 4),
    carpetBefore: createPrayerCarpetTexture(false),
    carpetAfter: createPrayerCarpetTexture(true),
    clock: createDigitalPrayerClockTexture(),
    allah: createCalligraphyPlaqueTexture('اللّٰه', isAfter),
    muhammad: createCalligraphyPlaqueTexture('مُحَمَّد', isAfter),
  }), [isAfter]);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  const innerWallColor = isAfter ? '#f5f2eb' : '#e6eee5';
  const trimColor = isAfter ? '#9e6d43' : '#cbd5e1';

  return (
    <group name="interior-space">
      {/* =====================================================================
          A. LANTAI UTAMA, LANTAI BASAH WUDHU, & PLAFON SOLID FULL-COVERAGE
          ===================================================================== */}
      <mesh position={[-0.66, 0.18, -3.48]} receiveShadow>
        <boxGeometry args={[7.18, 0.36, 14.8]} />
        <meshStandardMaterial map={textures.mainFloor} roughness={0.35} />
      </mesh>

      <mesh position={[-5.26, 0.13, -3.48]} receiveShadow>
        <boxGeometry args={[2.04, 0.26, 14.8]} />
        <meshStandardMaterial map={textures.wetFloor} roughness={0.55} />
      </mesh>

      {/* Plafon Solid Menutup Penuh Tanpa Celah */}
      <mesh position={[-1.705, 3.56, -3.49]} receiveShadow>
        <boxGeometry args={[9.45, 0.08, 15.0]} />
        <meshStandardMaterial
          color={isAfter ? '#f7f5f0' : '#f1f5f9'}
          roughness={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lis Plafon Depan (Aksen Rapi) */}
      <mesh position={[-1.7, 3.48, 3.8]}>
        <boxGeometry args={[9.15, 0.08, 0.08]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} />
      </mesh>

      {/* 6 Lampu Downlight Plafon Interior */}
      {[
        [-1.8, 3.51, 1.5],
        [1.0, 3.51, 1.5],
        [-1.8, 3.51, -2.5],
        [1.0, 3.51, -2.5],
        [-5.2, 3.51, -2.5],
        [0.8, 3.51, -7.2],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.14, 12]} />
          <meshStandardMaterial
            color={night ? '#fff7d6' : '#e2e8f0'}
            emissive={night ? '#ffe19c' : '#ffffff'}
            emissiveIntensity={night ? 3.0 : 0.35}
          />
        </mesh>
      ))}

      {/* 2 PointLight Non-Shadow Interior (Ringan & Hangat) */}
      <pointLight
        position={[-0.6, 3.1, -0.5]}
        color={night ? '#ffdfa3' : '#fff7eb'}
        intensity={night ? 14 : 4.2}
        distance={14}
        decay={2}
      />
      <pointLight
        position={[-1.5, 3.0, -7.2]}
        color={night ? '#ffdfa3' : '#fff7eb'}
        intensity={night ? 9 : 3.2}
        distance={11}
        decay={2}
      />

      {/* =====================================================================
          B. RUANG SHOLAT UTAMA & DINDING KIBLAT (100% SOLID DI BELAKANG MIHRAB!)
          ===================================================================== */}
      {/* Hamparan Karpet Sajadah Bershaf */}
      <mesh position={[-0.65, 0.372, -0.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.4, 7.6]} />
        <meshStandardMaterial
          map={isAfter ? textures.carpetAfter : textures.carpetBefore}
          roughness={0.9}
        />
      </mesh>

      {/* FIX 3: Dinding Interior Depan 100% SOLID Full-Height di Belakang Mihrab, Mimbar & Kaligrafi */}
      <mesh position={[-1.7, 1.825, 3.84]} receiveShadow>
        <boxGeometry args={[9.25, 3.65, 0.1]} />
        <meshStandardMaterial color={innerWallColor} roughness={0.7} />
      </mesh>
      {/* Plinth / Lis Bawah Dinding Depan */}
      <mesh position={[-1.7, 0.43, 3.78]}>
        <boxGeometry args={[9.2, 0.14, 0.03]} />
        <meshStandardMaterial color={trimColor} roughness={0.55} />
      </mesh>

      {/* --- MIHRAB IMAM, MIMBAR, JAM LED, KALIGRAFI & SPEAKER (Z = +3.80, hadap -Z) --- */}
      <group position={[-0.8, 0.36, 3.78]} rotation={[0, Math.PI, 0]}>
        {/* Panel Backdrop Mihrab */}
        <mesh position={[0, 1.55, 0.04]}>
          <boxGeometry args={[2.6, 3.1, 0.08]} />
          <meshStandardMaterial color={isAfter ? '#234a38' : '#1b7a3d'} roughness={0.6} />
        </mesh>
        {/* Bingkai Pilar Kiri & Kanan Mihrab */}
        <mesh position={[-1.25, 1.55, 0.14]}>
          <boxGeometry args={[0.18, 3.1, 0.22]} />
          <meshStandardMaterial color={isAfter ? '#9c6e46' : '#f8fafc'} roughness={0.5} />
        </mesh>
        <mesh position={[1.25, 1.55, 0.14]}>
          <boxGeometry args={[0.18, 3.1, 0.22]} />
          <meshStandardMaterial color={isAfter ? '#9c6e46' : '#f8fafc'} roughness={0.5} />
        </mesh>

        {/* Aksen Kisi Kayu & LED Strip Hangat Mihrab di Mode After */}
        {isAfter && (
          <>
            {[-0.95, -0.75, -0.55, 0.55, 0.75, 0.95].map((xSlat, i) => (
              <mesh key={i} position={[xSlat, 1.55, 0.1]}>
                <boxGeometry args={[0.06, 2.95, 0.05]} />
                <meshStandardMaterial color="#b38254" roughness={0.6} />
              </mesh>
            ))}
            <mesh position={[0, 2.92, 0.11]}>
              <boxGeometry args={[2.3, 0.04, 0.04]} />
              <meshStandardMaterial
                color="#fff3c4"
                emissive="#ffcf6b"
                emissiveIntensity={night ? 3.0 : 1.2}
              />
            </mesh>
          </>
        )}

        {/* Sajadah Khusus Imam */}
        <mesh position={[0, 0.015, 0.65]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 1.25]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.85} />
        </mesh>

        {/* Mimbar Kayu Kecil */}
        <WoodenMimbar position={[-1.95, 0, 0.55]} rotationY={0.18} />

        {/* Jam Jadwal Sholat Digital LED */}
        <mesh position={[0, 2.38, 0.12]}>
          <boxGeometry args={[1.45, 0.56, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.38, 0.155]}>
          <planeGeometry args={[1.38, 0.5]} />
          <meshStandardMaterial
            map={textures.clock}
            emissive="#ffffff"
            emissiveMap={textures.clock}
            emissiveIntensity={night ? 0.9 : 0.45}
          />
        </mesh>

        {/* Kaligrafi Allah & Muhammad */}
        <mesh position={[-1.95, 2.25, 0.08]}>
          <planeGeometry args={[0.68, 0.68]} />
          <meshStandardMaterial map={textures.allah} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[1.95, 2.25, 0.08]}>
          <planeGeometry args={[0.68, 0.68]} />
          <meshStandardMaterial map={textures.muhammad} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Speaker Dinding Kiri & Kanan Atas */}
        <WallSpeaker position={[-2.95, 2.7, 0.14]} rotationY={0.25} />
        <WallSpeaker position={[2.85, 2.7, 0.14]} rotationY={-0.25} />
      </group>

      {/* Kotak Amal / Infaq dekat Pintu Masuk Depan */}
      <DonationBox position={[2.35, 0.36, 1.85]} isAfter={isAfter} />

      {/* --- SEKAT PARTISI JAMAAH PEREMPUAN (Z = -2.15) --- */}
      <group position={[-1.65, 0.36, -2.15]}>
        {isAfter ? (
          /* Mode After: Partisi Geser Kisi Kayu Minimalis */
          <group>
            <mesh position={[0, 0.72, 0]} castShadow>
              <boxGeometry args={[4.2, 1.44, 0.06]} />
              <meshStandardMaterial color="#9e6d43" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.72, 0.035]}>
              <boxGeometry args={[3.95, 1.18, 0.02]} />
              <meshStandardMaterial color="#e8dfd1" roughness={0.7} />
            </mesh>
            {/* Bilah Kisi Kayu Vertikal Dekoratif */}
            {[-1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6].map((xS, idx) => (
              <mesh key={idx} position={[xS, 0.72, 0.05]}>
                <boxGeometry args={[0.04, 1.18, 0.02]} />
                <meshStandardMaterial color="#855836" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ) : (
          /* Mode Before: Tirai Kain Hijau di Tiang Besi */
          <group>
            <mesh position={[0, 1.38, 0]}>
              <boxGeometry args={[4.2, 0.04, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[-2.08, 0.7, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[2.08, 0.7, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[4.1, 1.28, 0.025]} />
              <meshStandardMaterial color="#15803d" roughness={0.85} />
            </mesh>
          </group>
        )}
      </group>

      {/* 2 Kipas Angin Gantung di Plafon Ruang Sholat */}
      <CeilingFan position={[-1.2, 3.5, 0.8]} />
      <CeilingFan position={[-1.2, 3.5, -2.2]} />

      {/* =====================================================================
          C. GUDANG (POJOK KIRI-ATAS DENAH: X = -6.2 s/d -4.2, Z = +1.4 s/d +3.85)
          ===================================================================== */}
      <group name="interior-gudang">
        <mesh position={[-4.25, 1.92, 2.65]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 3.16, 2.45]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.75} />
        </mesh>
        <mesh position={[-5.25, 1.92, 1.45]} castShadow receiveShadow>
          <boxGeometry args={[2.05, 3.16, 0.14]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.75} />
        </mesh>
        <mesh position={[-4.17, 1.38, 2.55]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.85, 2.02, 0.05]} />
          <meshStandardMaterial color={isAfter ? '#8c5d38' : '#6b4c35'} roughness={0.65} />
        </mesh>
        <QuranShelf position={[-4.05, 0.36, 0.45]} rotationY={Math.PI / 2} />
      </group>

      {/* =====================================================================
          D. TEMPAT WUDHU PRIA (LORONG TERBUKA TANPA PINTU, FULL KERAN!)
          Sepanjang Dinding Kiri X = -6.22, Z = +1.2 s/d -6.6
          ===================================================================== */}
      <group name="wudhu-pria">
        <mesh position={[-4.25, 1.25, -2.2]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 1.85, 5.4]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>
        <mesh position={[-6.2, 1.25, -2.7]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.8, 2.0]} />
          <meshStandardMaterial map={textures.wetWall} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-5.95, 0.27, -2.7]}>
          <boxGeometry args={[0.38, 0.03, 7.6]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {[0.5, -0.55, -1.6, -2.65, -3.7, -4.75, -5.8].map((zTap, idx) => (
          <WudhuFaucet key={idx} position={[-6.2, 0.98, zTap]} rotationY={Math.PI / 2} />
        ))}
      </group>

      {/* =====================================================================
          E. TEMPAT WUDHU WANITA & WC (POJOK KANAN-ATAS DENAH: Z = -7.0 s/d -10.85)
          ===================================================================== */}
      <group name="wudhu-wanita-dan-wc">
        {/* --- 1. TEMPAT WUDHU WANITA (X = -6.22 s/d -3.5, Z = -7.0 s/d -10.85) --- */}
        <mesh position={[-4.85, 1.25, -10.8]}>
          <planeGeometry args={[2.75, 2.0]} />
          <meshStandardMaterial map={textures.wetWall} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-4.85, 0.27, -10.58]}>
          <boxGeometry args={[2.6, 0.03, 0.36]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {[-5.8, -5.15, -4.5, -3.85].map((xTap, idx) => (
          <WudhuFaucet key={idx} position={[xTap, 0.98, -10.8]} rotationY={0} />
        ))}

        {/* Sekat Pemisah antara Wudhu Pria & Wudhu Wanita */}
        <mesh position={[-5.15, 1.55, -6.95]} castShadow>
          <boxGeometry args={[2.25, 2.6, 0.14]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>

        {/* FIX 2: Partisi Privasi Wudhu Wanita di Mode After (Tidak Nabrak Dinding WC X = -3.42!) */}
        {isAfter && (
          <group position={[-3.92, 1.46, -6.25]}>
            {/* Bingkai Partisi Kisi Kayu Menghadap Ruang Tengah (Menghalangi pandangan langsung, tetap lega dilewati) */}
            <mesh castShadow>
              <boxGeometry args={[0.92, 2.2, 0.07]} />
              <meshStandardMaterial color="#9e6d43" roughness={0.65} />
            </mesh>
            {[-0.3, -0.1, 0.1, 0.3].map((xSl, idx) => (
              <mesh key={idx} position={[xSl, 0, 0.04]}>
                <boxGeometry args={[0.04, 2.05, 0.025]} />
                <meshStandardMaterial color="#7c5230" roughness={0.6} />
              </mesh>
            ))}
          </group>
        )}

        {/* --- 2. WC / KAMAR MANDI TERTUTUP (X = -3.4 s/d -0.85, Z = -7.0 s/d -10.85) --- */}
        {/* Dinding Kiri WC */}
        <mesh position={[-3.42, 1.85, -8.92]} castShadow>
          <boxGeometry args={[0.14, 3.15, 3.85]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>
        {/* Dinding Depan WC */}
        <mesh position={[-2.12, 1.85, -7.0]} castShadow>
          <boxGeometry args={[2.6, 3.15, 0.14]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>

        {/* FIX 1: Dinding Kanan WC (X = -0.85) — Tertutup Rapat di Kiri, Kanan, & Atas Pintu PVC! */}
        {/* Segmen Belakang WC (Z: -10.85 s/d -8.38) */}
        <mesh position={[-0.85, 1.85, -9.615]} castShadow>
          <boxGeometry args={[0.14, 3.15, 2.47]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>
        {/* Segmen Pengisi Kanan Pintu (Z: -7.52 s/d -7.0) */}
        <mesh position={[-0.85, 1.85, -7.26]} castShadow>
          <boxGeometry args={[0.14, 3.15, 0.52]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>
        {/* Ambang Atas Pintu WC (Z: -8.38 s/d -7.52, Y: 2.34 s/d 3.43) */}
        <mesh position={[-0.85, 2.88, -7.95]} castShadow>
          <boxGeometry args={[0.14, 1.09, 0.86]} />
          <meshStandardMaterial color={innerWallColor} roughness={0.7} />
        </mesh>

        {/* Pintu PVC Kamar Mandi / WC + Handle */}
        <group position={[-0.85, 1.34, -7.95]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.86, 1.98, 0.06]} />
            <meshStandardMaterial color={isAfter ? '#94a3b8' : '#cbd5e1'} roughness={0.4} />
          </mesh>
          <mesh position={[0.3, -0.05, 0.05]}>
            <boxGeometry args={[0.04, 0.14, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Bak Air & Kloset di Dalam WC */}
        <mesh position={[-2.9, 0.68, -10.35]}>
          <boxGeometry args={[0.75, 0.82, 0.75]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.3} />
        </mesh>
        <mesh position={[-1.7, 0.45, -10.2]}>
          <boxGeometry args={[0.48, 0.35, 0.62]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
      </group>

      {/* =====================================================================
          F. AREA TEMPAT NARO SANDAL & SEPATU (DEKAT PINTU MASUK KANAN)
          ===================================================================== */}
      <group position={[1.75, 0.36, -10.45]}>
        {isAfter ? (
          <group>
            {[-0.9, 0.9].map((x, i) => (
              <mesh key={i} position={[x, 0.42, 0]}>
                <boxGeometry args={[0.06, 0.84, 0.38]} />
                <meshStandardMaterial color="#855836" roughness={0.65} />
              </mesh>
            ))}
            {[0.12, 0.44, 0.78].map((y, i) => (
              <mesh key={i} position={[0, y, 0]}>
                <boxGeometry args={[1.86, 0.04, 0.38]} />
                <meshStandardMaterial color="#9c6b45" roughness={0.6} />
              </mesh>
            ))}
            {[-0.6, -0.2, 0.2, 0.6].map((xS, i) => (
              <React.Fragment key={i}>
                <SandalPair position={[xS, 0.14, 0]} color={i % 2 === 0 ? '#1e293b' : '#7c2d12'} />
                <SandalPair position={[xS, 0.46, 0]} color={i % 2 === 0 ? '#334155' : '#0f766e'} />
              </React.Fragment>
            ))}
            {/* Bangku Duduk Lansia di Samping Rak */}
            <mesh position={[-1.55, 0.24, 0.35]}>
              <boxGeometry args={[0.95, 0.06, 0.38]} />
              <meshStandardMaterial color="#a6754e" roughness={0.6} />
            </mesh>
            <mesh position={[-1.95, 0.12, 0.35]}>
              <boxGeometry args={[0.06, 0.24, 0.34]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
            <mesh position={[-1.15, 0.12, 0.35]}>
              <boxGeometry args={[0.06, 0.24, 0.34]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          </group>
        ) : (
          <group>
            <SandalPair position={[-0.65, 0, 0.15]} rotationY={0.2} color="#1e293b" />
            <SandalPair position={[-0.15, 0, -0.05]} rotationY={-0.3} color="#1d4ed8" />
            <SandalPair position={[0.35, 0, 0.2]} rotationY={0.15} color="#374151" />
            <SandalPair position={[0.72, 0, 0.0]} rotationY={-0.1} color="#7f1d1d" />
          </group>
        )}
      </group>
    </group>
  );
}