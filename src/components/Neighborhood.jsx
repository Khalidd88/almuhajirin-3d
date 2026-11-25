import React, { useMemo, useEffect } from 'react';

import * as THREE from 'three';

/* ============================================================================
   1. PROCEDURAL TEXTURES RINGAN (MAX 256px, HALUS, ANTI-POLKADOT)
   ============================================================================ */

function createConcreteRoadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Base cor semen/aspal gang perumahan Bekasi
  ctx.fillStyle = '#86857f';
  ctx.fillRect(0, 0, 256, 256);

  // Gradasi halus pinggir jalan agak lembab/gelap (tanpa pola totol berulang)
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, 'rgba(55, 54, 50, 0.16)');
  grad.addColorStop(0.2, 'rgba(155, 153, 146, 0.04)');
  grad.addColorStop(0.5, 'rgba(130, 128, 122, 0.03)');
  grad.addColorStop(0.8, 'rgba(155, 153, 146, 0.04)');
  grad.addColorStop(1, 'rgba(55, 54, 50, 0.16)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Micro-grain pasir & agregat beton halus
  for (let i = 0; i < 6000; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    const v = 112 + ((i * 29) % 44);
    ctx.fillStyle = `rgba(${v}, ${v - 1}, ${v - 4}, 0.25)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Sambungan cor beton tipis
  ctx.strokeStyle = 'rgba(52, 51, 48, 0.26)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 128);
  ctx.lineTo(256, 128);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 18);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRosterTexture(isNight = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Lubang roster: gelap di siang hari, tembus cahaya hangat saat malam
  ctx.fillStyle = isNight ? '#ffbe6b' : '#2d1611';
  ctx.fillRect(0, 0, 256, 256);

  const cols = 10;
  const rows = 8;
  const cw = 256 / cols;
  const ch = 256 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw;
      const y = r * ch;
      ctx.strokeStyle = '#9e4733';
      ctx.lineWidth = 4.5;
      ctx.strokeRect(x + 2, y + 2, cw - 4, ch - 4);

      ctx.fillStyle = '#893b29';
      ctx.fillRect(x + 3, y + ch * 0.44, cw - 6, ch * 0.14);
      ctx.fillRect(x + cw * 0.44, y + 3, cw * 0.14, ch - 6);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 1.4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createExposedBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Adukan semen abu-abu
  ctx.fillStyle = '#948e87';
  ctx.fillRect(0, 0, 256, 256);

  const rows = 14;
  const cols = 6;
  const rh = 256 / rows;
  const cw = 256 / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cw * 0.5);
    for (let c = -1; c <= cols; c++) {
      const seed = (r * 31 + c * 17) & 31;
      const red = 132 + seed;
      const green = 68 + Math.floor(seed * 0.5);
      const blue = 50 + Math.floor(seed * 0.35);
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(c * cw + offset + 1.5, r * rh + 1.5, cw - 3, rh - 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2.6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoofTileTexture(baseHex = '#8c3f2c', darkHex = '#63291b') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 128, 128);

  for (let y = 0; y < 128; y += 16) {
    ctx.fillStyle = darkHex;
    ctx.fillRect(0, y, 128, 3);
    for (let x = 0; x < 128; x += 16) {
      ctx.fillStyle = 'rgba(255, 225, 200, 0.08)';
      ctx.fillRect(x + 2, y + 4, 7, 10);
      ctx.fillStyle = 'rgba(20, 10, 5, 0.14)';
      ctx.fillRect(x + 12, y + 3, 3, 12);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGardenFenceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#29381f';
  ctx.fillRect(0, 0, 128, 128);

  for (let x = 2; x < 128; x += 14) {
    const shade = 132 + ((x * 7) % 28);
    ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.72)}, ${Math.floor(shade * 0.44)})`;
    ctx.fillRect(x, 4, 9, 120);
  }

  ctx.fillStyle = '#6b492c';
  ctx.fillRect(0, 4, 128, 10);
  ctx.fillRect(0, 60, 128, 8);
  ctx.fillRect(0, 114, 128, 10);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createLightPoolTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(255, 224, 150, 0.68)');
  grad.addColorStop(0.42, 'rgba(255, 198, 105, 0.24)');
  grad.addColorStop(1, 'rgba(255, 180, 80, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStreetSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  // Plang jalan hijau khas Bekasi
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, 0, 256, 96);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(5, 5, 246, 86);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Jl. Bumi Bahagia', 128, 46);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillText('BUMI ANGGREK • BEKASI', 128, 74);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ============================================================================
   2. SUB-KOMPONEN DETAIL ARSITEKTUR RUMAH & LINGKUNGAN
   ============================================================================ */

function WallLamp({ position = [0, 0, 0], isNight = false }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.14, 0.22, 0.14]} />
        <meshLambertMaterial color="#1f2937" />
      </mesh>
      <mesh>
        <boxGeometry args={[0.15, 0.13, 0.15]} />
        <meshStandardMaterial
          color={isNight ? '#fff5cc' : '#e2e8f0'}
          emissive={isNight ? '#ffb94d' : '#000000'}
          emissiveIntensity={isNight ? 2.8 : 0}
        />
      </mesh>
      {isNight && (
        <mesh>
          <sphereGeometry args={[0.34, 8, 8]} />
          <meshBasicMaterial
            color="#ffcb77"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

function GlowingWindow({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [1.4, 1.2],
  isNight = false,
  litAtNight = true,
  frameColor = '#1e293b',
  warmColor = '#ffd080',
}) {
  const [w, h] = size;
  const active = isNight && litAtNight;

  return (
    <group position={position} rotation={rotation}>
      {/* Kusen Luar */}
      <mesh>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.08]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>
      {/* Kaca */}
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[w - 0.04, h - 0.04]} />
        <meshStandardMaterial
          color={active ? warmColor : '#2e4354'}
          emissive={active ? warmColor : '#000000'}
          emissiveIntensity={active ? 1.4 : 0}
          roughness={0.2}
          metalness={active ? 0.05 : 0.35}
        />
      </mesh>
      {/* Mullion Vertikal & Horizontal */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[0.04, h, 0.025]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>
      <mesh position={[0, h * 0.25, 0.045]}>
        <boxGeometry args={[w, 0.035, 0.025]} />
        <meshLambertMaterial color={frameColor} />
      </mesh>
      {/* Topi / Pelindung Hujan Jendela */}
      <mesh position={[0, h / 2 + 0.09, 0.12]}>
        <boxGeometry args={[w + 0.26, 0.06, 0.24]} />
        <meshLambertMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}

function DoorUnit({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#5c3d28' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.04, 2.1, 0.09]} />
        <meshLambertMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0, 1.02, 0.02]}>
        <boxGeometry args={[0.9, 2.0, 0.06]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Handle pintu */}
      <mesh position={[0.32, 0.98, 0.07]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshLambertMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}

function OutdoorAC({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.66, 0.46, 0.26]} />
        <meshLambertMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0.08, 0, 0.135]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 12]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
    </group>
  );
}

function WaterTank({ position = [0, 0, 0], color = '#d48d44' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.42, 0.45, 1.04, 12]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.2, 0.42, 0.14, 12]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function PottedPlant({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.16, 0.11, 0.32, 8]} />
        <meshLambertMaterial color="#7d4936" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <dodecahedronGeometry args={[0.26, 0]} />
        <meshLambertMaterial color="#3c7029" />
      </mesh>
      <mesh position={[0.1, 0.56, 0.05]}>
        <dodecahedronGeometry args={[0.16, 0]} />
        <meshLambertMaterial color="#4f8838" />
      </mesh>
    </group>
  );
}

function BananaCluster({ position = [0, 0, 0], scale = 1 }) {
  const stems = [
    { pos: [0, 0, 0], h: 2.8, r: 0.14, rotY: 0.2 },
    { pos: [0.48, 0, -0.35], h: 2.15, r: 0.11, rotY: 1.7 },
    { pos: [-0.36, 0, 0.34], h: 1.65, r: 0.09, rotY: 3.2 },
  ];
  const frondAngles = [0, 0.95, 1.9, 2.85, 3.8, 4.75, 5.6];

  return (
    <group position={position} scale={scale}>
      {stems.map((s, idx) => (
        <group key={idx} position={s.pos} rotation={[0, s.rotY, 0]}>
          <mesh position={[0, s.h / 2, 0]}>
            <cylinderGeometry args={[s.r * 0.75, s.r, s.h, 7]} />
            <meshLambertMaterial color="#586f3f" />
          </mesh>
          {frondAngles.map((ang, fIdx) => (
            <group key={fIdx} position={[0, s.h - 0.15, 0]} rotation={[0, ang, 0]}>
              <mesh position={[0.45, 0.22, 0]} rotation={[0.1, 0, 0.25]}>
                <boxGeometry args={[0.95, 0.03, 0.36]} />
                <meshLambertMaterial color={fIdx % 2 === 0 ? '#3f7328' : '#4b8231'} />
              </mesh>
              <mesh position={[1.15, 0.06, 0]} rotation={[0.12, 0, -0.45]}>
                <boxGeometry args={[0.78, 0.025, 0.32]} />
                <meshLambertMaterial color={fIdx % 2 === 0 ? '#356421' : '#45782c'} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function ParkedScooter({ position = [0, 0, 0], rotationY = 0, bodyColor = '#1e293b' }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.24, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 10]} />
        <meshLambertMaterial color="#18181b" />
      </mesh>
      <mesh position={[0, 0.24, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 10]} />
        <meshLambertMaterial color="#18181b" />
      </mesh>
      <mesh position={[0, 0.58, -0.15]}>
        <boxGeometry args={[0.42, 0.38, 1.05]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 0.8, -0.22]}>
        <boxGeometry args={[0.36, 0.1, 0.72]} />
        <meshLambertMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 0.68, 0.45]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.38, 0.68, 0.22]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 1.02, 0.38]}>
        <boxGeometry args={[0.64, 0.06, 0.08]} />
        <meshLambertMaterial color="#27272a" />
      </mesh>
    </group>
  );
}

function CatenaryWire({ start, end, sag = 0.28 }) {
  const segments = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const pts = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = vStart.clone().lerp(vEnd, t);
      p.y -= Math.sin(t * Math.PI) * sag;
      pts.push(p);
    }
    const segs = [];
    for (let i = 0; i < steps; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      segs.push({ mid, len, quat });
    }
    return segs;
  }, [start, end, sag]);

  return (
    <group>
      {segments.map((s, idx) => (
        <mesh key={idx} position={s.mid} quaternion={s.quat}>
          <cylinderGeometry args={[0.013, 0.013, s.len + 0.01, 4]} />
          <meshLambertMaterial color="#1b1f23" />
        </mesh>
      ))}
    </group>
  );
}

function StreetLampPole({
  position = [0, 0, 0],
  armRotationY = 0,
  isNight = false,
  lightPoolTex,
  withJunctionBox = false,
  withRealLight = false,
  poleHeight = 7.6,
}) {
  const lampOffset = useMemo(() => {
    const rad = armRotationY;
    return [Math.cos(rad) * 1.15, poleHeight - 0.9, -Math.sin(rad) * 1.15];
  }, [armRotationY, poleHeight]);

  return (
    <group position={position}>
      {/* Tiang Beton PLN */}
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.095, 0.15, poleHeight, 8]} />
        <meshLambertMaterial color="#878a8c" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.5, 8]} />
        <meshLambertMaterial color="#6e7173" />
      </mesh>

      {/* Kotak Sambungan PLN Hijau */}
      {withJunctionBox && (
        <group position={[0.14, 3.6, 0.08]}>
          <mesh>
            <boxGeometry args={[0.24, 0.36, 0.22]} />
            <meshLambertMaterial color="#2a6b3d" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 6]} />
            <meshLambertMaterial color="#374151" />
          </mesh>
        </group>
      )}

      {/* Crossarm & Isolator */}
      <group position={[0, poleHeight - 0.35, 0]}>
        <mesh>
          <boxGeometry args={[1.35, 0.08, 0.08]} />
          <meshLambertMaterial color="#52575c" />
        </mesh>
        {[-0.55, 0, 0.55].map((xIso, i) => (
          <mesh key={i} position={[xIso, 0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.14, 6]} />
            <meshLambertMaterial color="#d1d5db" />
          </mesh>
        ))}
      </group>

      {/* Lengan & Kap Lampu PJU */}
      <group position={[0, poleHeight - 1.15, 0]} rotation={[0, armRotationY, 0]}>
        <mesh position={[0.55, 0.18, 0]} rotation={[0, 0, -1.25]}>
          <cylinderGeometry args={[0.025, 0.03, 1.25, 6]} />
          <meshLambertMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[1.15, 0.32, 0]}>
          <boxGeometry args={[0.42, 0.1, 0.22]} />
          <meshLambertMaterial color="#475569" />
        </mesh>
        <mesh position={[1.15, 0.25, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.15]} />
          <meshStandardMaterial
            color={isNight ? '#fff5d6' : '#cbd5e1'}
            emissive={isNight ? '#ffca6b' : '#000000'}
            emissiveIntensity={isNight ? 3.4 : 0}
            roughness={0.2}
          />
        </mesh>
        {isNight && (
          <mesh position={[1.15, -2.15, 0]}>
            <coneGeometry args={[2.8, 4.8, 16, 1, true]} />
            <meshBasicMaterial
              color="#ffd280"
              transparent
              opacity={0.09}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>

      {/* Light Pool di Aspal saat Mode Malam */}
      {isNight && lightPoolTex && (
        <mesh position={[lampOffset[0], 0.028, lampOffset[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.4, 7.4]} />
          <meshBasicMaterial
            map={lightPoolTex}
            transparent
            opacity={0.72}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* PointLight Nyata (dibatasi 3 titik utama saja biar 60 FPS di HP) */}
      {isNight && withRealLight && (
        <pointLight
          position={[lampOffset[0], poleHeight - 1.3, lampOffset[2]]}
          color="#ffc978"
          intensity={16}
          distance={20}
          decay={2}
        />
      )}
    </group>
  );
}

/**
 * Rumah Perumahan Bekasi Detail (Modular untuk deretan gang kanan, seberang jalan, & belakang gang)
 */
function DetailedBekasiHouse({
  position = [0, 0, 0],
  rotationY = 0,
  width = 6.2,
  depth = 6.2,
  wallColor = '#ece6dc',
  accentColor = '#d4c9bc',
  fenceColor = '#cbd5e1',
  roofTex,
  isNight = false,
  litWindow = true,
  hasSecondFloor = false,
  hasScooter = false,
}) {
  const h1 = 3.4;
  const roofBaseY = hasSecondFloor ? 6.4 : h1;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Halaman Carport Cor & Keramik Teras */}
      <mesh position={[0, 0.03, depth / 2 + 1.0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.06, 2.0]} />
        <meshLambertMaterial color="#b4b0a8" />
      </mesh>
      <mesh position={[-width * 0.18, 0.12, depth / 2 + 0.45]} receiveShadow>
        <boxGeometry args={[width * 0.56, 0.24, 0.9]} />
        <meshLambertMaterial color="#d6cfc4" />
      </mesh>

      {/* Pagar Tembok Depan + Gerbang Besi Hitam + Pilar Lampu */}
      <mesh position={[-width * 0.25, 0.72, depth / 2 + 1.92]} receiveShadow>
        <boxGeometry args={[width * 0.48, 1.44, 0.18]} />
        <meshLambertMaterial color={fenceColor} />
      </mesh>
      <mesh position={[-width * 0.25, 1.46, depth / 2 + 1.92]}>
        <boxGeometry args={[width * 0.5, 0.06, 0.24]} />
        <meshLambertMaterial color="#94a3b8" />
      </mesh>
      {/* Gerbang Besi Carport */}
      <mesh position={[width * 0.24, 0.72, depth / 2 + 1.92]}>
        <boxGeometry args={[width * 0.46, 1.38, 0.05]} />
        <meshLambertMaterial color="#334155" />
      </mesh>
      {/* Pilar Pagar Kiri & Tengah + Lampu Pilar */}
      <mesh position={[-width / 2 + 0.14, 0.88, depth / 2 + 1.92]}>
        <boxGeometry args={[0.28, 1.76, 0.28]} />
        <meshLambertMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.02, 0.88, depth / 2 + 1.92]}>
        <boxGeometry args={[0.28, 1.76, 0.28]} />
        <meshLambertMaterial color="#94a3b8" />
      </mesh>
      <WallLamp position={[0.02, 1.86, depth / 2 + 1.92]} isNight={isNight} />

      {/* Badan Utama Lantai 1 */}
      <mesh position={[0, h1 / 2, 0]} receiveShadow>
        <boxGeometry args={[width, h1, depth]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>
      {/* Plinth Bawah Batu/Abu */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[width + 0.06, 0.44, depth + 0.06]} />
        <meshLambertMaterial color="#948e87" />
      </mesh>
      {/* Aksen Pilar Depan */}
      <mesh position={[-width / 2 + 0.2, h1 / 2, depth / 2 + 0.04]}>
        <boxGeometry args={[0.36, h1, 0.16]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      <mesh position={[width / 2 - 0.2, h1 / 2, depth / 2 + 0.04]}>
        <boxGeometry args={[0.36, h1, 0.16]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>

      {/* Pintu Utama, Jendela Depan, Outdoor AC & Lampu Teras */}
      <DoorUnit position={[-width * 0.26, 0.18, depth / 2 + 0.02]} />
      <GlowingWindow
        position={[width * 0.16, 1.72, depth / 2 + 0.03]}
        size={[1.65, 1.25]}
        isNight={isNight}
        litAtNight={litWindow}
      />
      <OutdoorAC position={[width * 0.36, 2.75, depth / 2 + 0.16]} />
      <WallLamp position={[-width * 0.04, 2.28, depth / 2 + 0.08]} isNight={isNight} />

      {/* Kanopi Carport Minimalis (Spandek + Tiang Besi) */}
      <mesh position={[width * 0.12, 2.68, depth / 2 + 1.02]} rotation={[0.14, 0, 0]}>
        <boxGeometry args={[width * 0.72, 0.07, 2.05]} />
        <meshLambertMaterial color="#475569" />
      </mesh>
      <mesh position={[width * 0.44, 1.32, depth / 2 + 1.82]}>
        <boxGeometry args={[0.08, 2.64, 0.08]} />
        <meshLambertMaterial color="#334155" />
      </mesh>

      {/* Opsi Lantai 2 */}
      {hasSecondFloor && (
        <group position={[0, h1, 0]}>
          <mesh position={[0, 0.12, 0.15]}>
            <boxGeometry args={[width + 0.4, 0.24, depth + 0.5]} />
            <meshLambertMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[0, 1.5, -0.2]} receiveShadow>
            <boxGeometry args={[width - 0.2, 3.0, depth - 0.4]} />
            <meshLambertMaterial color={wallColor} />
          </mesh>
          <GlowingWindow
            position={[-width * 0.18, 1.55, depth / 2 - 0.38]}
            size={[1.5, 1.25]}
            isNight={isNight}
            litAtNight={!litWindow}
          />
          <GlowingWindow
            position={[width * 0.2, 1.55, depth / 2 - 0.38]}
            size={[1.3, 1.25]}
            isNight={isNight}
            litAtNight={true}
          />
          {/* Railing Balkon Atas */}
          <mesh position={[0, 0.65, depth / 2 + 0.3]}>
            <boxGeometry args={[width - 0.2, 0.9, 0.06]} />
            <meshLambertMaterial color="#334155" />
          </mesh>
        </group>
      )}

      {/* Lisplang & Atap Limasan Sejajar Tembok (Rotasi pada <mesh>!) */}
      <mesh position={[0, roofBaseY + 0.08, 0]}>
        <boxGeometry args={[width + 0.5, 0.18, depth + 0.5]} />
        <meshLambertMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, roofBaseY + 0.98, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(width, depth) * 0.78, 1.75, 4]} />
        <meshLambertMaterial map={roofTex} color="#964632" />
      </mesh>

      {/* Tanaman Pot & Motor Parkir Opsional */}
      <PottedPlant position={[-width * 0.42, 0.06, depth / 2 + 1.4]} scale={0.95} />
      {hasScooter && (
        <ParkedScooter position={[width * 0.24, 0.06, depth / 2 + 1.0]} rotationY={0.25} bodyColor="#1e293b" />
      )}
    </group>
  );
}

/**
 * Rumah Tetangga Desa/Perumahan Ringan & Luwes (Tidak kaku: ada teras, pintu, lisplang, & pot)
 * Tanpa castShadow agar tetap 60 FPS di HP!
 */
function LightBekasiHouse({
  position = [0, 0, 0],
  rotationY = 0,
  width = 6.0,
  depth = 5.6,
  wallColor = '#e2dbd0',
  roofColor = '#7d3a29',
  isNight = false,
  litWindow = true,
  hasSecondFloor = false,
}) {
  const h = hasSecondFloor ? 5.9 : 3.25;
  const winActive = isNight && litWindow;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pondasi / Plinth Bawah */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[width + 0.08, 0.28, depth + 0.08]} />
        <meshLambertMaterial color="#8c867e" />
      </mesh>

      {/* Bodi Utama */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[width, h, depth]} />
        <meshLambertMaterial color={wallColor} />
      </mesh>

      {/* Teras Depan & Kanopi Teras Kecil (Biar tidak kotak kaku!) */}
      <mesh position={[0, 0.08, depth / 2 + 0.65]}>
        <boxGeometry args={[width * 0.72, 0.16, 1.3]} />
        <meshLambertMaterial color="#d4cec4" />
      </mesh>
      <mesh position={[0, 2.55, depth / 2 + 0.6]} rotation={[0.14, 0, 0]}>
        <boxGeometry args={[width * 0.74, 0.08, 1.35]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>
      {[-width * 0.3, width * 0.3].map((xCol, idx) => (
        <mesh key={idx} position={[xCol, 1.32, depth / 2 + 1.15]}>
          <boxGeometry args={[0.14, 2.4, 0.14]} />
          <meshLambertMaterial color="#f1f5f9" />
        </mesh>
      ))}

      {/* Pintu Kayu Depan */}
      <mesh position={[-width * 0.18, 1.15, depth / 2 + 0.02]}>
        <boxGeometry args={[0.88, 2.02, 0.05]} />
        <meshLambertMaterial color="#6b442a" />
      </mesh>

      {/* Lisplang Atap (Overhang) */}
      <mesh position={[0, h + 0.06, 0]}>
        <boxGeometry args={[width + 0.55, 0.14, depth + 0.55]} />
        <meshLambertMaterial color="#f8fafc" />
      </mesh>

      {/* Atap Limasan (Rotasi di <mesh>) */}
      <mesh position={[0, h + 0.88, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(width, depth) * 0.78, 1.65, 4]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>

      {/* Jendela Berkusen Emissive Lantai 1 */}
      <mesh position={[width * 0.2, 1.55, depth / 2 + 0.02]}>
        <boxGeometry args={[1.45, 1.12, 0.04]} />
        <meshLambertMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[width * 0.2, 1.55, depth / 2 + 0.045]}>
        <planeGeometry args={[1.28, 0.96]} />
        <meshStandardMaterial
          color={winActive ? '#ffd080' : '#2e4354'}
          emissive={winActive ? '#ffd080' : '#000000'}
          emissiveIntensity={winActive ? 1.25 : 0}
        />
      </mesh>

      {/* Jendela Emissive Lantai 2 (jika 2 lantai) */}
      {hasSecondFloor && (
        <>
          <mesh position={[0, 4.45, depth / 2 + 0.02]}>
            <boxGeometry args={[2.0, 1.15, 0.04]} />
            <meshLambertMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 4.45, depth / 2 + 0.045]}>
            <planeGeometry args={[1.82, 0.98]} />
            <meshStandardMaterial
              color={winActive ? '#ffd080' : '#2e4354'}
              emissive={winActive ? '#ffd080' : '#000000'}
              emissiveIntensity={winActive ? 1.25 : 0}
            />
          </mesh>
        </>
      )}

      {/* Pot Tanaman Kecil di Teras */}
      <mesh position={[-width * 0.36, 0.26, depth / 2 + 0.9]}>
        <cylinderGeometry args={[0.16, 0.12, 0.24, 6]} />
        <meshLambertMaterial color="#8f4a32" />
      </mesh>
      <mesh position={[-width * 0.36, 0.48, depth / 2 + 0.9]}>
        <dodecahedronGeometry args={[0.24, 0]} />
        <meshLambertMaterial color="#3c732a" />
      </mesh>
    </group>
  );
}

/**
 * Pohon Rindang Pekarangan Desa (Ringan Low-Poly tanpa castShadow)
 */
function VillageTree({ position = [0, 0, 0], scale = 1, leafColor = '#3a6e28' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 2.4, 7]} />
        <meshLambertMaterial color="#5c4028" />
      </mesh>
      <mesh position={[0, 2.75, 0]}>
        <dodecahedronGeometry args={[1.15, 0]} />
        <meshLambertMaterial color={leafColor} />
      </mesh>
      <mesh position={[0.65, 2.35, 0.4]}>
        <dodecahedronGeometry args={[0.78, 0]} />
        <meshLambertMaterial color="#488233" />
      </mesh>
      <mesh position={[-0.6, 2.45, -0.35]}>
        <dodecahedronGeometry args={[0.82, 0]} />
        <meshLambertMaterial color="#2f5e20" />
      </mesh>
    </group>
  );
}

/**
 * Pos Ronda / Pos Kamling Kampung (Ikon Desa Damai Indonesia)
 */
function PosRonda({ position = [0, 0, 0], rotationY = 0, isNight = false }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Lantai Semen */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[2.2, 0.24, 2.0]} />
        <meshLambertMaterial color="#b4b0a8" />
      </mesh>
      {/* Dinding Setengah Badan */}
      <mesh position={[0, 0.65, -0.88]}>
        <boxGeometry args={[2.1, 0.9, 0.14]} />
        <meshLambertMaterial color="#e2dbd0" />
      </mesh>
      <mesh position={[-0.98, 0.65, 0]}>
        <boxGeometry args={[0.14, 0.9, 1.9]} />
        <meshLambertMaterial color="#e2dbd0" />
      </mesh>
      <mesh position={[0.98, 0.65, 0]}>
        <boxGeometry args={[0.14, 0.9, 1.9]} />
        <meshLambertMaterial color="#e2dbd0" />
      </mesh>
      {/* 4 Tiang Kayu */}
      {[
        [-0.95, 1.25, -0.85],
        [0.95, 1.25, -0.85],
        [-0.95, 1.25, 0.85],
        [0.95, 1.25, 0.85],
      ].map(([xP, yP, zP], idx) => (
        <mesh key={idx} position={[xP, yP, zP]}>
          <boxGeometry args={[0.1, 2.1, 0.1]} />
          <meshLambertMaterial color="#6b442a" />
        </mesh>
      ))}
      {/* Bangku Kayu Panjang di Dalam Pos */}
      <mesh position={[0, 0.48, -0.45]}>
        <boxGeometry args={[1.65, 0.08, 0.45]} />
        <meshLambertMaterial color="#8c5832" />
      </mesh>
      {/* Atap Genteng Piramid */}
      <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.85, 0.9, 4]} />
        <meshLambertMaterial color="#8e402d" />
      </mesh>
      {/* Lampu Hangat Pos Ronda */}
      <mesh position={[0, 2.12, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial
          color={isNight ? '#fef08a' : '#e2e8f0'}
          emissive={isNight ? '#ffca6b' : '#000000'}
          emissiveIntensity={isNight ? 2.8 : 0}
        />
      </mesh>
    </group>
  );
}

/**
 * Bangku Bambu / Kayu Santai Khas Desa Indonesia
 */
function VillageBench({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 4 Kaki Bangku Kayu */}
      {[-0.65, 0.65].map((xK, idx) => (
        <group key={idx} position={[xK, 0.22, 0]}>
          <mesh position={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.035, 0.04, 0.44, 6]} />
            <meshLambertMaterial color="#543722" />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.035, 0.04, 0.44, 6]} />
            <meshLambertMaterial color="#543722" />
          </mesh>
        </group>
      ))}
      {/* Papan Dudukan Bambu */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.45]} />
        <meshLambertMaterial color="#82522c" />
      </mesh>
      {/* Sandaran Belakang */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.5, 0.28, 0.04]} />
        <meshLambertMaterial color="#82522c" />
      </mesh>
      {[-0.6, 0.6].map((xS, idx) => (
        <mesh key={idx} position={[xS, 0.65, -0.2]}>
          <cylinderGeometry args={[0.03, 0.035, 0.45, 6]} />
          <meshLambertMaterial color="#543722" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Plang Nama Jalan "Jl. Bumi Bahagia"
 */
function StreetSignPole({ position = [-10.4, 0, 4.4], signTex }) {
  return (
    <group position={position}>
      {/* Tiang Besi */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 2.7, 8]} />
        <meshLambertMaterial color="#475569" />
      </mesh>
      {/* Papan Nama Jalan (2 sisi agar terbaca dari depan maupun gang) */}
      <mesh position={[0.42, 2.52, 0]}>
        <boxGeometry args={[0.92, 0.34, 0.04]} />
        <meshLambertMaterial color="#065f46" />
      </mesh>
      <mesh position={[0.42, 2.52, 0.025]}>
        <planeGeometry args={[0.88, 0.3]} />
        <meshLambertMaterial map={signTex} />
      </mesh>
      <mesh position={[0.42, 2.52, -0.025]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.88, 0.3]} />
        <meshLambertMaterial map={signTex} />
      </mesh>
    </group>
  );
}

/**
 * Polisi Tidur (Speed Bump) Hitam-Kuning Pudar
 */
function SpeedBump({ position = [0, 0, 0], width = 3.8 }) {
  const segments = 7;
  const segW = width / segments;

  return (
    <group position={position}>
      {Array.from({ length: segments }, (_, i) => (
        <mesh
          key={i}
          position={[(i - (segments - 1) / 2) * segW, 0.025, 0]}
          receiveShadow
        >
          <boxGeometry args={[segW - 0.01, 0.055, 0.28]} />
          <meshLambertMaterial color={i % 2 === 0 ? '#27272a' : '#ca9a24'} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Tong Sampah Warga Kecil (Pinggir Pagar Rumah)
 */
function TrashBin({ position = [0, 0, 0], color = '#166534' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.17, 0.14, 0.52, 10]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.05, 10]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

/* ============================================================================
   3. KOMPONEN UTAMA: NEIGHBORHOOD (SKALA NYATA GOOGLE EARTH 1:1)
   Koordinat Baku (1 Unit = 1 Meter):
   - Musholla Utama: X = -6.5 s/d +3.0 (lebar 9.5m), Z = -11.0 s/d +4.0 (panjang 15m)
   - Gang Jl. Bumi Bahagia (Kiri): X = -10.5 s/d -6.5 (lebar 4.0m), lurus ke -Z
   - Gang Tembus Kanopi (Kanan): X = +3.0 s/d +7.5 (lebar 4.5m), lurus ke -Z
   - 2 Rumah Tetangga Belakang Musholla: X = -6.5 s/d +3.0, Z = -11.0 s/d -27.0
   - Persimpangan Gang Belok Kanan: Z = -27.0 s/d -31.0 (lebar 4.0m) tembus ke +X!
   - Jalan Pertigaan Depan: Z = +4.2 s/d +16.5
   ============================================================================ */

export default function Neighborhood({ isNight = false, timeOfDay }) {
  const night = Boolean(isNight) || timeOfDay === 'night' || timeOfDay === 'isya';

  const textures = useMemo(() => {
    const roadLeft = createConcreteRoadTexture();
    const roadRight = roadLeft.clone();
    roadRight.needsUpdate = true;
    roadRight.repeat.set(1, 18);

    const roadFront = roadLeft.clone();
    roadFront.needsUpdate = true;
    roadFront.repeat.set(16, 3);

    const roadCross = roadLeft.clone();
    roadCross.needsUpdate = true;
    roadCross.repeat.set(10, 1);

    return {
      roadLeft,
      roadRight,
      roadFront,
      roadCross,
      rosterDay: createRosterTexture(false),
      rosterNight: createRosterTexture(true),
      brick: createExposedBrickTexture(),
      roofRed: createRoofTileTexture('#8e402d', '#682b1c'),
      roofBrown: createRoofTileTexture('#734736', '#4f2f23'),
      woodFence: createGardenFenceTexture(),
      lightPool: createLightPoolTexture(),
      streetSign: createStreetSignTexture(),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  const bioporiZ = useMemo(() => [-10.0, -7.0, -4.0, -1.0, 2.0], []);

  return (
    <group name="neighborhood">
      {/* =====================================================================
          A. HAMPARAN HORIZON & JARINGAN 4 JALAN (ANTI-MAKET MELAYANG)
          ===================================================================== */}
      {/* Base tanah pekarangan hijau asri 220x220 menyatu mulus ke fog horizon */}
      <mesh position={[0, -0.06, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshLambertMaterial color={night ? '#1a2417' : '#597543'} />
      </mesh>

      {/* 1. JALAN GANG KIRI: JL. BUMI BAHAGIA (X = -10.5 s/d -6.5, Z = -31.0 s/d +4.5) */}
      <mesh position={[-8.5, 0.002, -13.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.0, 35.5]} />
        <meshLambertMaterial map={textures.roadLeft} color={night ? '#8e96a3' : '#b8b7b0'} />
      </mesh>

      {/* 1b. JALAN GANG BARAT (Akses Rumah Sisi Kiri: X = -20.8 s/d -17.2, Z = -31.0 s/d +4.5) */}
      <mesh position={[-19.0, 0.003, -13.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 35.5]} />
        <meshLambertMaterial map={textures.roadLeft} color={night ? '#8e96a3' : '#b8b7b0'} />
      </mesh>

      {/* 2. JALAN GANG TEMBUS KANAN (BAWAH KANOPI): X = +3.0 s/d +7.5, Z = -31.0 s/d +4.5 */}
      <mesh position={[5.25, 0.004, -13.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, 35.5]} />
        <meshLambertMaterial map={textures.roadRight} color={night ? '#929aa8' : '#c0beb6'} />
      </mesh>

      {/* 2b. JALAN GANG TIMUR (Akses Deretan Rumah Kanan: X = +15.7 s/d +19.3, Z = -31.0 s/d +4.5) */}
      <mesh position={[17.5, 0.005, -13.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 35.5]} />
        <meshLambertMaterial map={textures.roadRight} color={night ? '#8e96a3' : '#b8b7b0'} />
      </mesh>

      {/* 3. JALAN PERTIGAAN DEPAN (Z = +4.2 s/d +16.5) */}
      <mesh position={[0, 0.008, 10.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[86, 12.3]} />
        <meshLambertMaterial map={textures.roadFront} color={night ? '#89919e' : '#b3b2aa'} />
      </mesh>

      {/* 4. PERSIMPANGAN GANG BELOK BELAKANG (Menghubungkan Gang Barat, Jl. Bumi Bahagia, Kanopi, & Gang Timur) */}
      <mesh position={[0, 0.009, -29.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[56.0, 4.0]} />
        <meshLambertMaterial map={textures.roadCross} color={night ? '#8e96a3' : '#b8b7b0'} />
      </mesh>

      {/* Marka Kuning Pudar Pinggir Jl. Bumi Bahagia & Sudut Belokan */}
      <mesh position={[-6.72, 0.016, -11.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.09, 31]} />
        <meshLambertMaterial color="#cfb246" />
      </mesh>
      <mesh position={[-10.22, 0.016, -11.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.09, 31]} />
        <meshLambertMaterial color="#cfb246" />
      </mesh>
      {/* Lengkung marka kuning sudut depan musholla & gerbang kanan */}
      <mesh position={[-5.35, 0.017, 4.35]} rotation={[-Math.PI / 2, 0, Math.PI * 0.52]}>
        <ringGeometry args={[1.3, 1.4, 20, 1, 0, Math.PI * 0.48]} />
        <meshLambertMaterial color="#cfb246" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[7.05, 0.017, 4.75]} rotation={[-Math.PI / 2, 0, Math.PI * 0.92]}>
        <ringGeometry args={[1.18, 1.28, 20, 1, 0, Math.PI * 0.5]} />
        <meshLambertMaterial color="#cfb246" side={THREE.DoubleSide} />
      </mesh>

      {/* =====================================================================
          B. DRAINASE / TALI AIR & LUBANG BIOPORI PINGGIR KIRI MUSHOLLA (X = -6.62)
          ===================================================================== */}
      <mesh position={[-6.62, 0.012, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.24, 15.5]} />
        <meshLambertMaterial color="#4e504d" />
      </mesh>
      {bioporiZ.map((zPos, i) => (
        <group key={i} position={[-6.62, 0.02, zPos]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.11, 12]} />
            <meshLambertMaterial color="#9aa0a6" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 10]} />
            <meshLambertMaterial color="#16181a" />
          </mesh>
        </group>
      ))}

      {/* =====================================================================
          C. SISI KIRI JL. BUMI BAHAGIA (X < -10.5): KEBUN RINDANG & PAGAR BIRU
          ===================================================================== */}
      <group position={[-10.68, 0, -9]}>
        {/* Tanggul beton rendah bercat biru khas Street View */}
        <mesh position={[0.14, 0.14, 0]}>
          <boxGeometry args={[0.34, 0.28, 36]} />
          <meshLambertMaterial color="#347bc2" />
        </mesh>
        <mesh position={[0.14, 0.3, 0]}>
          <boxGeometry args={[0.38, 0.06, 36]} />
          <meshLambertMaterial color="#9e5340" />
        </mesh>
        {/* Pagar Kayu/Bambu Kebun Pendek */}
        <mesh position={[-0.04, 0.88, 0]}>
          <boxGeometry args={[0.08, 1.15, 36]} />
          <meshLambertMaterial map={textures.woodFence} />
        </mesh>
        {[-16, -12, -8, -4, 0, 4, 8, 12, 16].map((zPost, idx) => (
          <mesh key={idx} position={[-0.04, 0.92, zPost]}>
            <boxGeometry args={[0.14, 1.28, 0.14]} />
            <meshLambertMaterial color="#593c24" />
          </mesh>
        ))}
        {/* Tanah Kebun Hijau Rindang (Pas di antara Jl. Bumi Bahagia & Gang Barat: X = -18.5 s/d -10.68) */}
        <mesh position={[-3.9, -0.01, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.8, 33]} />
          <meshLambertMaterial color={night ? '#1a2615' : '#3d572a'} />
        </mesh>
      </group>

      {/* Pos Ronda / Pos Kamling Kampung di Pojok Pekarangan Kiri Depan */}
      <PosRonda position={[-12.6, 0, 1.8]} rotationY={Math.PI / 2} isNight={night} />

      {/* Semak Tropis & Rumpun Pohon Pisang Sepanjang Kiri Jalan */}
      {[
        [-11.4, 0.55, 6.0, 0.9],
        [-11.5, 0.65, 3.2, 1.1],
        [-11.3, 0.55, 0.2, 0.95],
        [-11.6, 0.7, -3.0, 1.15],
        [-11.4, 0.55, -6.4, 0.95],
        [-11.7, 0.65, -10.2, 1.05],
        [-11.5, 0.6, -14.2, 1.0],
        [-11.6, 0.65, -18.5, 1.05],
        [-11.5, 0.55, -22.5, 0.95],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <dodecahedronGeometry args={[r, 0]} />
          <meshLambertMaterial color={i % 2 === 0 ? '#366924' : '#487c31'} />
        </mesh>
      ))}
      <BananaCluster position={[-12.5, 0, 2.2]} scale={1.15} />
      <BananaCluster position={[-13.0, 0, -3.8]} scale={1.1} />
      <BananaCluster position={[-12.6, 0, -10.5]} scale={1.2} />
      <BananaCluster position={[-13.2, 0, -17.5]} scale={1.05} />
      <BananaCluster position={[-12.8, 0, -23.5]} scale={1.1} />

      {/* =====================================================================
          D. 2 RUMAH TETANGGA DI BELAKANG MUSHOLLA (Z = -11.0 s/d -27.0)
          Sebelum Persimpangan Gang Belok Kanan (Z = -27.0 s/d -31.0)!
          ===================================================================== */}

      {/* Tower Antena / Tiang Toa Hijau di Belakang Atap Musholla */}
      <group position={[1.4, 0, -11.3]}>
        <mesh position={[0, 5.0, 0]}>
          <cylinderGeometry args={[0.04, 0.14, 10.0, 4]} />
          <meshLambertMaterial color="#3c6647" wireframe />
        </mesh>
        <mesh position={[0.18, 9.5, 0.1]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.35, 8]} />
          <meshLambertMaterial color="#d1d5db" />
        </mesh>
        <mesh position={[-0.18, 9.5, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.35, 8]} />
          <meshLambertMaterial color="#d1d5db" />
        </mesh>
      </group>

      {/* --- RUMAH TETANGGA 1 (Z = -11.0 s/d -19.0): RUMAH BATA EKSPOS 2 LANTAI + GUDANG RENDAH --- */}
      <group position={[-1.75, 0, -15.0]}>
        {/* Sisi Kiri (X: -6.5 s/d -0.5): Bangunan 2 Lantai Bata Merah Ekspos (Persis Street View!) */}
        <group position={[-1.75, 0, -0.3]}>
          {/* Dinding Bata Merah 2 Lantai */}
          <mesh position={[0, 3.2, 0]} receiveShadow>
            <boxGeometry args={[6.0, 6.4, 7.2]} />
            <meshLambertMaterial map={textures.brick} />
          </mesh>
          {/* Ring Balok & Kolom Beton Abu-Abu */}
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[6.16, 0.28, 7.36]} />
            <meshLambertMaterial color="#a8a5a0" />
          </mesh>
          <mesh position={[0, 6.32, 0]}>
            <boxGeometry args={[6.16, 0.22, 7.36]} />
            <meshLambertMaterial color="#a8a5a0" />
          </mesh>
          {[-2.96, 0, 2.96].map((xCol, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[xCol, 3.2, 3.56]}>
                <boxGeometry args={[0.26, 6.4, 0.26]} />
                <meshLambertMaterial color="#a8a5a0" />
              </mesh>
              <mesh position={[xCol, 3.2, -3.56]}>
                <boxGeometry args={[0.26, 6.4, 0.26]} />
                <meshLambertMaterial color="#a8a5a0" />
              </mesh>
            </React.Fragment>
          ))}
          {/* Jendela Lantai 2 Menghadap Depan (+Z) & Jl. Bumi Bahagia (-X) */}
          <GlowingWindow position={[-1.4, 4.65, 3.63]} size={[1.35, 1.3]} isNight={night} litAtNight={true} frameColor="#4a3f38" />
          <GlowingWindow position={[1.4, 4.65, 3.63]} size={[1.35, 1.3]} isNight={night} litAtNight={false} frameColor="#4a3f38" />
          <GlowingWindow position={[-3.03, 4.65, 1.4]} rotation={[0, -Math.PI / 2, 0]} size={[1.4, 1.25]} isNight={night} litAtNight={true} frameColor="#4a3f38" />
          <GlowingWindow position={[-3.03, 4.65, -1.4]} rotation={[0, -Math.PI / 2, 0]} size={[1.4, 1.25]} isNight={night} litAtNight={false} frameColor="#4a3f38" />
          {/* Lantai 1 Samping Gang Kiri: Pintu + Jendela + Lampu Teras */}
          <DoorUnit position={[-3.03, 0.1, 1.6]} rotation={[0, -Math.PI / 2, 0]} color="#4a3525" />
          <GlowingWindow position={[-3.03, 1.65, -1.2]} rotation={[0, -Math.PI / 2, 0]} size={[1.4, 1.15]} isNight={night} litAtNight={true} frameColor="#4a3f38" />
          <WallLamp position={[-3.08, 2.25, 0.4]} isNight={night} />
          {/* Toren Air Oranye di Dak Atas (Persis Street View!) */}
          <WaterTank position={[-1.7, 6.42, 1.8]} color="#d4924c" />
        </group>

        {/* Sisi Kanan (X: -0.5 s/d +3.0): Bangunan Rendah Beratap Genteng Persis di Belakang Dinding Hijau */}
        <group position={[3.0, 0, 0.6]}>
          <mesh position={[0, 1.3, 0]} receiveShadow>
            <boxGeometry args={[3.4, 2.6, 6.2]} />
            <meshLambertMaterial color="#ddd3c7" />
          </mesh>
          <mesh position={[0.12, 2.76, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[3.9, 0.14, 6.5]} />
            <meshLambertMaterial map={textures.roofRed} color="#9c4a35" />
          </mesh>
          <GlowingWindow position={[1.73, 1.45, 0.6]} rotation={[0, Math.PI / 2, 0]} size={[1.3, 1.0]} isNight={night} litAtNight={true} />
          <WallLamp position={[1.76, 2.1, -1.2]} isNight={night} />
          {/* Pot tanaman di pinggir gang kanan */}
          <PottedPlant position={[1.92, 0, 2.2]} scale={1.15} />
          <PottedPlant position={[1.92, 0, 1.3]} scale={1.0} />
          <PottedPlant position={[1.92, 0, -2.0]} scale={1.2} />
        </group>
      </group>

      {/* --- RUMAH TETANGGA 2 (Z = -19.0 s/d -27.0): RUMAH BIRU & RUMAH KREM SEBELUM GANG BELOK KANAN --- */}
      <group position={[-1.75, 0, -23.0]}>
        {/* Badan Utama Rumah Tembok Biru (Terlihat jelas di ujung lorong kanopi Street View!) */}
        <group position={[1.45, 0, 0]}>
          <mesh position={[0, 2.15, 0]} receiveShadow>
            <boxGeometry args={[6.5, 4.3, 7.6]} />
            <meshLambertMaterial color="#3877ba" />
          </mesh>
          {/* Lis Plang Putih */}
          <mesh position={[0, 4.36, 0]}>
            <boxGeometry args={[6.8, 0.18, 7.9]} />
            <meshLambertMaterial color="#e2eaf2" />
          </mesh>
          {/* Atap Genteng Sejajar Tembok */}
          <mesh position={[0, 5.28, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[5.4, 1.75, 4]} />
            <meshLambertMaterial map={textures.roofRed} color="#824030" />
          </mesh>
          {/* Jendela & Pintu Menghadap Gang Kanan (+X) & Gang Belok (-Z) */}
          <GlowingWindow position={[3.28, 2.2, 1.4]} rotation={[0, Math.PI / 2, 0]} size={[1.55, 1.2]} isNight={night} litAtNight={true} frameColor="#f1f5f9" />
          <DoorUnit position={[3.28, 0.08, -1.4]} rotation={[0, Math.PI / 2, 0]} color="#3b2f2f" />
          <WallLamp position={[3.32, 2.45, -0.2]} isNight={night} />
          <GlowingWindow position={[0.4, 2.2, -3.83]} rotation={[0, Math.PI, 0]} size={[1.6, 1.2]} isNight={night} litAtNight={true} frameColor="#f1f5f9" />
        </group>

        {/* Bagian Kiri Rumah 2 Menghadap Jl. Bumi Bahagia (-X) */}
        <group position={[-3.25, 0, 0]}>
          <mesh position={[0, 1.8, 0]} receiveShadow>
            <boxGeometry args={[3.0, 3.6, 7.6]} />
            <meshLambertMaterial color="#e6ddd2" />
          </mesh>
          <mesh position={[0, 4.25, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[3.6, 1.35, 4]} />
            <meshLambertMaterial map={textures.roofBrown} color="#6e4435" />
          </mesh>
          <GlowingWindow position={[-1.53, 1.75, 1.4]} rotation={[0, -Math.PI / 2, 0]} size={[1.4, 1.15]} isNight={night} litAtNight={true} />
          <DoorUnit position={[-1.53, 0.08, -1.4]} rotation={[0, -Math.PI / 2, 0]} />
          <WallLamp position={[-1.58, 2.3, 0.0]} isNight={night} />
          <ParkedScooter position={[-1.9, 0, 0.2]} rotationY={0.15} bodyColor="#991b1b" />
        </group>
      </group>

      {/* =====================================================================
          E. SISI KANAN GANG TEMBUS (X > +7.5): RUMAH PUTIH MODERN + DERETAN TETANGGA
          ===================================================================== */}
      {/* 1. RUMAH MODERN PUTIH 2 LANTAI + ROSTER BATA MERAH (Ciri Khas Street View!) */}
      <group position={[7.7, 0, -0.2]}>
        {/* Tembok Pagar Putih Sisi Gang Kanan (X = +7.7) */}
        <mesh position={[0, 0.94, 0.2]} receiveShadow>
          <boxGeometry args={[0.24, 1.88, 9.6]} />
          <meshLambertMaterial color="#eceff2" />
        </mesh>
        <mesh position={[0, 0.2, 0.2]}>
          <boxGeometry args={[0.29, 0.4, 9.65]} />
          <meshLambertMaterial color="#bfc6cc" />
        </mesh>
        <mesh position={[0, 1.9, 0.2]}>
          <boxGeometry args={[0.32, 0.08, 9.7]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>

        {/* Tembok Pagar Putih Belok ke Kanan Menghadap Jalan Depan (Z = +4.9) */}
        <mesh position={[4.2, 0.94, 4.9]} receiveShadow>
          <boxGeometry args={[8.6, 1.88, 0.24]} />
          <meshLambertMaterial color="#f1f4f7" />
        </mesh>
        <mesh position={[4.2, 0.2, 4.9]}>
          <boxGeometry args={[8.65, 0.4, 0.29]} />
          <meshLambertMaterial color="#bfc6cc" />
        </mesh>
        <mesh position={[4.2, 1.9, 4.9]}>
          <boxGeometry args={[8.7, 0.08, 0.32]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>

        {/* Pilar Sudut Pagar + Lampu Pilar Menyala saat Malam */}
        <mesh position={[0, 1.02, 4.9]}>
          <boxGeometry args={[0.38, 2.04, 0.38]} />
          <meshLambertMaterial color="#e2e8f0" />
        </mesh>
        <WallLamp position={[0, 2.15, 4.9]} isNight={night} />
        <WallLamp position={[4.4, 2.1, 4.9]} isNight={night} />

        {/* Bangunan Utama Rumah Putih 2 Lantai */}
        <group position={[4.0, 0, 0.3]}>
          {/* Lantai 1 Putih */}
          <mesh position={[0, 1.78, 0]} receiveShadow>
            <boxGeometry args={[6.8, 3.56, 8.2]} />
            <meshLambertMaterial color="#f3f5f8" />
          </mesh>
          {/* Jendela Kaca Bingkai Hitam Lantai 1 */}
          <GlowingWindow position={[-0.8, 1.78, 4.13]} size={[2.5, 1.65]} isNight={night} litAtNight={true} frameColor="#181e26" />
          <GlowingWindow position={[-3.43, 1.78, 1.2]} rotation={[0, -Math.PI / 2, 0]} size={[2.2, 1.55]} isNight={night} litAtNight={true} frameColor="#181e26" />
          <WallLamp position={[1.6, 2.38, 4.16]} isNight={night} />
          <WallLamp position={[-3.46, 2.38, -1.2]} isNight={night} />

          {/* Dak Beton Cantilever Pembatas Lantai 2 */}
          <mesh position={[-0.25, 3.6, 0.25]}>
            <boxGeometry args={[7.4, 0.24, 8.8]} />
            <meshLambertMaterial color="#e2e7ec" />
          </mesh>

          {/* Lantai 2 Putih */}
          <mesh position={[0, 5.2, 0]} receiveShadow>
            <boxGeometry args={[6.8, 3.0, 8.2]} />
            <meshLambertMaterial color="#f5f7fa" />
          </mesh>

          {/* Fasad Roster Bata Merah Besar di Lantai 2 (Tembus cahaya hangat saat malam!) */}
          <mesh position={[-0.2, 5.2, 4.14]}>
            <planeGeometry args={[5.0, 2.38]} />
            <meshStandardMaterial
              map={night ? textures.rosterNight : textures.rosterDay}
              emissive={night ? '#ffad4d' : '#000000'}
              emissiveMap={night ? textures.rosterNight : null}
              emissiveIntensity={night ? 0.6 : 0}
              roughness={0.85}
            />
          </mesh>
          <mesh position={[-3.44, 5.2, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[4.8, 2.38]} />
            <meshStandardMaterial
              map={night ? textures.rosterNight : textures.rosterDay}
              emissive={night ? '#ffad4d' : '#000000'}
              emissiveMap={night ? textures.rosterNight : null}
              emissiveIntensity={night ? 0.6 : 0}
              roughness={0.85}
            />
          </mesh>

          {/* Lisplang Putih & Atap Limasan Sejajar Tembok */}
          <mesh position={[0, 6.76, 0]}>
            <boxGeometry args={[7.4, 0.2, 8.8]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 7.72, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[6.0, 1.82, 4]} />
            <meshLambertMaterial map={textures.roofRed} color="#8c4230" />
          </mesh>
        </group>

        {/* Tanaman hias mengintip di balik pagar putih */}
        <mesh position={[1.2, 1.65, 4.05]}>
          <dodecahedronGeometry args={[0.76, 0]} />
          <meshLambertMaterial color="#3c7028" />
        </mesh>
        <mesh position={[0.75, 1.48, 2.4]}>
          <dodecahedronGeometry args={[0.56, 0]} />
          <meshLambertMaterial color="#4b8333" />
        </mesh>
      </group>

      {/* 2. TAMAN BELAKANG RUMAH PUTIH & DERETAN RUMAH GANG TIMUR (ASRI & BERJARAK) */}
      {/* Kebun/Pekarangan Belakang Rumah Putih (X = 7.7 s/d 15.5, Z = -5.0 s/d -28.0) */}
      <mesh position={[11.6, -0.01, -16.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.8, 23.0]} />
        <meshLambertMaterial color={night ? '#192615' : '#3e5c2b'} />
      </mesh>
      {/* Pepohonan Rindang di Pekarangan Belakang Rumah Putih */}
      <VillageTree position={[11.5, 0, -9.5]} scale={1.2} leafColor="#366b26" />
      <VillageTree position={[11.8, 0, -17.5]} scale={1.15} leafColor="#447e30" />
      <VillageTree position={[11.4, 0, -24.5]} scale={1.1} leafColor="#316122" />

      {/* Deretan 4 Rumah Asri Menghadap Gang Timur (X = 23.5, dengan jarak pekarangan 2.5m antar rumah) */}
      <DetailedBekasiHouse
        position={[23.5, 0, 0.5]}
        rotationY={-Math.PI / 2}
        width={6.2}
        depth={5.8}
        wallColor="#ebe4d8"
        accentColor="#cfc4b4"
        fenceColor="#d6d3cd"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
        hasScooter={true}
      />
      <DetailedBekasiHouse
        position={[23.5, 0, -8.5]}
        rotationY={-Math.PI / 2}
        width={6.2}
        depth={5.8}
        wallColor="#dde6e2"
        accentColor="#b8c9c2"
        fenceColor="#cbd5d1"
        roofTex={textures.roofRed}
        isNight={night}
        litWindow={false}
        hasSecondFloor={true}
      />
      <DetailedBekasiHouse
        position={[23.5, 0, -17.5]}
        rotationY={-Math.PI / 2}
        width={6.2}
        depth={5.8}
        wallColor="#f0e5d6"
        accentColor="#d9c6ad"
        fenceColor="#d6c8b6"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
        hasScooter={false}
      />
      <LightBekasiHouse
        position={[23.5, 0, -25.5]}
        rotationY={-Math.PI / 2}
        width={6.0}
        depth={5.6}
        wallColor="#e3dcd2"
        roofColor="#714434"
        isNight={night}
        litWindow={true}
        hasSecondFloor={true}
      />

      {/* =====================================================================
          F. DERETAN RUMAH DI SEBERANG GANG BELOK KANAN (Z < -31.0) & HORIZON
          ===================================================================== */}
      <LightBekasiHouse
        position={[-12.0, 0, -36.5]}
        rotationY={0}
        width={6.6}
        depth={6.0}
        wallColor="#e6dfd4"
        roofColor="#714434"
        isNight={night}
        litWindow={false}
      />
      <DetailedBekasiHouse
        position={[-4.5, 0, -36.5]}
        rotationY={0}
        width={6.8}
        depth={6.0}
        wallColor="#e4ddd2"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
        hasScooter={true}
      />
      <DetailedBekasiHouse
        position={[3.2, 0, -36.5]}
        rotationY={0}
        width={6.8}
        depth={6.0}
        wallColor="#dce3e8"
        roofTex={textures.roofRed}
        isNight={night}
        litWindow={false}
        hasSecondFloor={true}
      />
      <DetailedBekasiHouse
        position={[11.2, 0, -36.5]}
        rotationY={0}
        width={6.8}
        depth={6.0}
        wallColor="#ece1d3"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
      />
      <LightBekasiHouse
        position={[19.5, 0, -36.5]}
        rotationY={0}
        width={6.8}
        depth={6.0}
        wallColor="#dfe6e3"
        roofColor="#8a422f"
        isNight={night}
        litWindow={true}
        hasSecondFloor={true}
      />

      {/* Baris Siluet Belakang Gang Belok (Z = -46.0) untuk menutup horizon */}
      {[
        { x: -11.0, wall: '#ddd6cc', roof: '#6e3a2c', f2: false, lit: true },
        { x: -3.0, wall: '#e5e0d7', roof: '#7c4332', f2: true, lit: false },
        { x: 5.0, wall: '#d8e0de', roof: '#643b2c', f2: false, lit: true },
        { x: 13.0, wall: '#eae2d6', roof: '#85402e', f2: true, lit: true },
        { x: 21.0, wall: '#dfd8ce', roof: '#6e3a2c', f2: false, lit: false },
      ].map((h, i) => (
        <LightBekasiHouse
          key={`back-sil-${i}`}
          position={[h.x, 0, -46.0]}
          rotationY={0}
          width={6.6}
          depth={5.8}
          wallColor={h.wall}
          roofColor={h.roof}
          isNight={night}
          litWindow={h.lit}
          hasSecondFloor={h.f2}
        />
      ))}

      {/* Blok Sisi Kiri Menghadap Gang Barat (X = -24.8, menghadap +X ke Gang Barat) */}
      {[
        { z: 0.5, wall: '#e6dfd4', roof: '#7a3e2e', f2: true, lit: true },
        { z: -8.5, wall: '#dce4e1', roof: '#643b2c', f2: false, lit: false },
        { z: -17.5, wall: '#ebe3d6', roof: '#883f2d', f2: true, lit: true },
        { z: -25.5, wall: '#e4ddd2', roof: '#714434', f2: false, lit: true },
      ].map((h, i) => (
        <LightBekasiHouse
          key={`left-house-${i}`}
          position={[-24.8, 0, h.z]}
          rotationY={Math.PI / 2}
          width={6.2}
          depth={5.6}
          wallColor={h.wall}
          roofColor={h.roof}
          isNight={night}
          litWindow={h.lit}
          hasSecondFloor={h.f2}
        />
      ))}

      {/* =====================================================================
          G. TIANG LISTRIK, LAMPU PJU MALAM, & KABEL MELINTANG
          ===================================================================== */}
      {/* 1. Tiang Beton PLN Utama + PJU di Pojok Gerbang Kanan (X = 7.65, Z = 4.75) */}
      <StreetLampPole
        position={[7.65, 0, 4.75]}
        armRotationY={Math.PI * 0.78}
        isNight={night}
        lightPoolTex={textures.lightPool}
        withJunctionBox={true}
        withRealLight={true}
        poleHeight={8.4}
      />

      {/* Tiang Besi Gelap (Telkom/WiFi) + Gulungan Kabel Fiber tepat di sebelahnya */}
      <group position={[8.35, 0, 5.05]}>
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.055, 0.075, 7.6, 8]} />
          <meshLambertMaterial color="#2c3034" />
        </mesh>
        <mesh position={[0, 4.4, 0.12]}>
          <torusGeometry args={[0.24, 0.035, 6, 14]} />
          <meshLambertMaterial color="#17191c" />
        </mesh>
      </group>

      {/* 2. Tiang PLN + PJU di Sisi Kiri Depan Jl. Bumi Bahagia */}
      <StreetLampPole
        position={[-10.55, 0, 4.0]}
        armRotationY={-0.12}
        isNight={night}
        lightPoolTex={textures.lightPool}
        withRealLight={true}
        poleHeight={7.9}
      />

      {/* 3. Tiang PJU di Dalam Gang Tembus Kanan */}
      <StreetLampPole
        position={[7.65, 0, -14.0]}
        armRotationY={Math.PI}
        isNight={night}
        lightPoolTex={textures.lightPool}
        withRealLight={true}
        poleHeight={7.4}
      />

      {/* 4. Tiang PJU di Persimpangan Gang Belok Kanan (Z = -26.8) */}
      <StreetLampPole
        position={[-10.55, 0, -26.5]}
        armRotationY={-0.35}
        isNight={night}
        lightPoolTex={textures.lightPool}
        withRealLight={false}
        poleHeight={7.4}
      />

      {/* Kabel Listrik Melintang Natural (Catenary) */}
      <CatenaryWire start={[7.65, 8.05, 4.75]} end={[-10.55, 7.55, 4.0]} sag={0.42} />
      <CatenaryWire start={[7.65, 7.6, 4.75]} end={[-10.55, 7.1, 4.0]} sag={0.48} />
      <CatenaryWire start={[7.65, 7.0, 4.75]} end={[7.65, 7.0, -14.0]} sag={0.35} />
      <CatenaryWire start={[7.65, 7.0, -14.0]} end={[7.65, 6.8, -31.0]} sag={0.32} />
      <CatenaryWire start={[-10.55, 7.3, 4.0]} end={[-10.55, 7.0, -26.5]} sag={0.5} />

      {/* =====================================================================
          H. DERETAN RUMAH SEBERANG JALAN DEPAN (Z = +22.0, X = -28 s/d +28)
          ===================================================================== */}
      <LightBekasiHouse
        position={[-27.5, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#e5dfd5"
        roofColor="#7a3e2e"
        isNight={night}
        litWindow={false}
      />
      <LightBekasiHouse
        position={[-20.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#dce4e2"
        roofColor="#643b2c"
        isNight={night}
        litWindow={true}
        hasSecondFloor={true}
      />
      <DetailedBekasiHouse
        position={[-12.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#e2dbd0"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
      />
      <DetailedBekasiHouse
        position={[-4.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#ebe7df"
        roofTex={textures.roofRed}
        isNight={night}
        litWindow={false}
      />
      <DetailedBekasiHouse
        position={[4.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#dbe3e1"
        roofTex={textures.roofBrown}
        isNight={night}
        litWindow={true}
        hasSecondFloor={true}
      />
      <DetailedBekasiHouse
        position={[12.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#eae0d3"
        roofTex={textures.roofRed}
        isNight={night}
        litWindow={true}
      />
      <LightBekasiHouse
        position={[20.0, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#e4dcd0"
        roofColor="#8a422f"
        isNight={night}
        litWindow={true}
      />
      <LightBekasiHouse
        position={[27.5, 0, 22.0]}
        rotationY={Math.PI}
        width={6.4}
        depth={5.8}
        wallColor="#dde3e6"
        roofColor="#714434"
        isNight={night}
        litWindow={false}
        hasSecondFloor={true}
      />

      {/* =====================================================================
          I. DETAIL KHAS GANG PERUMAHAN BEKASI (PLANG JALAN, POLISI TIDUR, TONG SAMPAH)
          ===================================================================== */}
      {/* Plang Nama Jalan "Jl. Bumi Bahagia" di pojok pertigaan depan kiri */}
      <StreetSignPole position={[-10.4, 0, 4.4]} signTex={textures.streetSign} />

      {/* Polisi Tidur di Mulut Gang Kiri, Gang Kanan, Gang Barat, & Gang Timur */}
      <SpeedBump position={[-8.5, 0, 3.2]} width={3.8} />
      <SpeedBump position={[5.25, 0, 3.2]} width={4.2} />
      <SpeedBump position={[-19.0, 0, 3.2]} width={3.4} />
      <SpeedBump position={[17.5, 0, 3.2]} width={3.4} />

      {/* Bangku Bambu / Kayu Santai Warga Kampung Damai */}
      <VillageBench position={[-12.6, 0, 3.6]} rotationY={Math.PI / 2} />
      <VillageBench position={[-15.2, 0, -4.5]} rotationY={0.3} />
      <VillageBench position={[18.8, 0, 3.8]} rotationY={-Math.PI / 2} />

      {/* Pohon Rindang Pekarangan Desa (Menambah kesan asri, teduh & damai) */}
      {[
        // Pekarangan kebun kiri (antara Jl. Bumi Bahagia & Gang Barat)
        [-15.6, 0, -2.5, 1.05, '#3a6e28'],
        [-16.2, 0, -9.5, 1.15, '#467d32'],
        [-15.2, 0, -16.5, 0.95, '#336123'],
        [-16.4, 0, -23.5, 1.1, '#3f732c'],
        // Pekarangan rumah kiri (X = -22.8)
        [-22.8, 0, 2.5, 1.0, '#467d32'],
        [-22.6, 0, -6.8, 0.9, '#3a6e28'],
        [-22.8, 0, -16.2, 1.05, '#336123'],
        // Pekarangan rumah kanan (pinggir Gang Timur)
        [22.2, 0, 2.8, 0.95, '#3f732c'],
        [22.0, 0, -5.8, 1.05, '#3a6e28'],
        [22.2, 0, -14.0, 0.9, '#467d32'],
        [22.0, 0, -21.5, 1.0, '#336123'],
        // Halaman rumah seberang jalan depan
        [-16.0, 0, 17.5, 1.0, '#3a6e28'],
        [-8.0, 0, 17.5, 0.88, '#467d32'],
        [0.0, 0, 17.5, 0.92, '#3f732c'],
        [16.2, 0, 17.5, 1.05, '#336123'],
      ].map(([x, y, z, s, c], idx) => (
        <VillageTree key={`vtree-${idx}`} position={[x, y, z]} scale={s} leafColor={c} />
      ))}

      {/* Tong Sampah Warga di Pinggir Beberapa Pagar Rumah Tetangga */}
      <TrashBin position={[7.95, 0, -6.2]} color="#166534" />
      <TrashBin position={[7.95, 0, -13.4]} color="#1e293b" />
      <TrashBin position={[7.95, 0, -20.5]} color="#166534" />
      <TrashBin position={[-8.8, 0, 17.0]} color="#1e293b" />
      <TrashBin position={[0.4, 0, 17.0]} color="#166534" />
      <TrashBin position={[8.2, 0, 17.0]} color="#1e293b" />
    </group>
  );
}