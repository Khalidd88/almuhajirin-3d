import React from 'react';

/* ============================================================================
   1. KENDARAAN LOW-POLY PROCEDURAL (100% RINGAN, TANPA ASET EKSTERNAL)
   Aturan wajib: semua prop `rotation` diletakkan di <mesh> atau <group>.
   ============================================================================ */

/**
 * Mobil MPV / City Car Low-Poly
 * Ukuran skala nyata: Panjang ~4.1m, Lebar ~1.68m, Tinggi ~1.58m
 */
function LowPolyCar({
  position = [0, 0, 0],
  rotationY = 0,
  bodyColor = '#cbd5e1',
  isNight = false,
  isSUV = true,
}) {
  const cabinHeight = isSUV ? 0.62 : 0.52;
  const cabinLength = isSUV ? 2.45 : 1.95;
  const cabinZ = isSUV ? -0.25 : -0.15;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Sasis / Bawah Bodi Gelap */}
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <boxGeometry args={[1.66, 0.24, 4.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Bodi Utama Bawah (Kap mesin & pintu) */}
      <mesh position={[0, 0.64, 0]} receiveShadow>
        <boxGeometry args={[1.68, 0.44, 4.0]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.35} />
      </mesh>

      {/* Kabin Atas */}
      <mesh position={[0, 0.86 + cabinHeight / 2, cabinZ]} receiveShadow>
        <boxGeometry args={[1.48, cabinHeight, cabinLength]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.35} />
      </mesh>

      {/* Kaca Depan & Belakang (Tinted Gelap) */}
      <mesh position={[0, 0.86 + cabinHeight / 2, cabinZ + cabinLength / 2 + 0.01]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.38, cabinHeight * 0.82, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.86 + cabinHeight / 2, cabinZ - cabinLength / 2 - 0.01]} rotation={[0.14, 0, 0]}>
        <boxGeometry args={[1.36, cabinHeight * 0.8, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.6} />
      </mesh>

      {/* Kaca Samping Kiri & Kanan */}
      {[-0.75, 0.75].map((xSide, idx) => (
        <mesh key={idx} position={[xSide, 0.86 + cabinHeight * 0.52, cabinZ]}>
          <boxGeometry args={[0.03, cabinHeight * 0.72, cabinLength * 0.84]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.6} />
        </mesh>
      ))}

      {/* Spion Kiri & Kanan */}
      {[-0.88, 0.88].map((xMirror, idx) => (
        <mesh key={idx} position={[xMirror, 0.88, 0.75]}>
          <boxGeometry args={[0.14, 0.09, 0.1]} />
          <meshStandardMaterial color={bodyColor} roughness={0.4} />
        </mesh>
      ))}

      {/* Grille Depan & Plat Nomor */}
      <mesh position={[0, 0.56, 2.02]}>
        <boxGeometry args={[0.88, 0.22, 0.03]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.36, 2.04]}>
        <boxGeometry args={[0.38, 0.11, 0.02]} />
        <meshStandardMaterial color="#090d12" roughness={0.4} />
      </mesh>

      {/* Lampu Utama Depan (Menyala saat Malam) */}
      {[-0.6, 0.6].map((xLight, idx) => (
        <mesh key={idx} position={[xLight, 0.65, 2.01]}>
          <boxGeometry args={[0.28, 0.13, 0.04]} />
          <meshStandardMaterial
            color={isNight ? '#fef9c3' : '#e2e8f0'}
            emissive={isNight ? '#fde047' : '#000000'}
            emissiveIntensity={isNight ? 2.6 : 0}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Sorotan Cahaya Lampu Depan saat Malam */}
      {isNight && (
        <mesh position={[0, 0.025, 3.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 3.2]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.14} depthWrite={false} />
        </mesh>
      )}

      {/* Lampu Belakang Merah */}
      {[-0.62, 0.62].map((xTail, idx) => (
        <mesh key={idx} position={[xTail, 0.68, -2.01]}>
          <boxGeometry args={[0.26, 0.14, 0.04]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive={isNight ? '#ef4444' : '#7f1d1d'}
            emissiveIntensity={isNight ? 1.8 : 0.2}
          />
        </mesh>
      ))}

      {/* 4 Roda & Velg */}
      {[
        [-0.78, 0.29, 1.25],
        [0.78, 0.29, 1.25],
        [-0.78, 0.29, -1.25],
        [0.78, 0.29, -1.25],
      ].map(([xW, yW, zW], idx) => (
        <group key={idx} position={[xW, yW, zW]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.29, 0.29, 0.22, 14]} />
            <meshStandardMaterial color="#171717" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.17, 0.17, 0.23, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Motor Matic / Skuter Harian Warga Low-Poly
 */
function LowPolyMotorbike({ position = [0, 0, 0], rotationY = 0, bodyColor = '#1e3a8a' }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Roda Depan & Belakang */}
      {[0.58, -0.58].map((zW, idx) => (
        <mesh key={idx} position={[0, 0.22, zW]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 12]} />
          <meshStandardMaterial color="#171717" roughness={0.85} />
        </mesh>
      ))}
      {/* Bodi & Jok */}
      <mesh position={[0, 0.56, -0.15]}>
        <boxGeometry args={[0.32, 0.28, 0.92]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, -0.18]}>
        <boxGeometry args={[0.26, 0.08, 0.65]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
      {/* Dek Kaki & Tameng Depan */}
      <mesh position={[0, 0.34, 0.15]}>
        <boxGeometry args={[0.28, 0.08, 0.45]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.66, 0.45]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.28, 0.58, 0.14]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>
      {/* Setang & Lampu */}
      <mesh position={[0, 0.98, 0.42]}>
        <boxGeometry args={[0.62, 0.06, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.82, 0.53]}>
        <boxGeometry args={[0.14, 0.1, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ============================================================================
   2. KARAKTER MANUSIA STYLIZED LOW-POLY (JAMAAH, PELAJAR, LANSIA, UMKM)
   ============================================================================ */

/**
 * Figur Warga / Jamaah Modular
 * Pose: 'standing' | 'sitting' | 'praying_sit' | 'qr_scan'
 * Headwear: 'peci' | 'hijab' | 'cap' | 'none'
 */
function StylizedPerson({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  shirtColor = '#f8fafc',
  pantsColor = '#1e293b',
  skinColor = '#d6a37a',
  headwear = 'peci',
  hijabColor = '#64748b',
  pose = 'standing',
  hasBackpack = false,
  hasPhone = false,
}) {
  const isSitting = pose === 'sitting';
  const isPrayingSit = pose === 'praying_sit';

  // Offset dasar tubuh sesuai pose duduk atau berdiri
  const hipY = isSitting ? 0.04 : isPrayingSit ? 0.14 : 0.78;
  const torsoY = hipY + 0.28;
  const headY = torsoY + 0.36;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* --- KAKI --- */}
      {isPrayingSit ? (
        /* Duduk tasyahud/ila di atas karpet */
        <mesh position={[0, 0.07, 0.05]}>
          <boxGeometry args={[0.38, 0.14, 0.44]} />
          <meshLambertMaterial color={pantsColor} />
        </mesh>
      ) : isSitting ? (
        /* Duduk di bangku */
        <>
          <mesh position={[-0.09, 0.02, 0.14]}>
            <boxGeometry args={[0.14, 0.12, 0.34]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.09, 0.02, 0.14]}>
            <boxGeometry args={[0.14, 0.12, 0.34]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
          <mesh position={[-0.09, -0.18, 0.27]}>
            <boxGeometry args={[0.13, 0.36, 0.13]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.09, -0.18, 0.27]}>
            <boxGeometry args={[0.13, 0.36, 0.13]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
        </>
      ) : (
        /* Berdiri */
        <>
          <mesh position={[-0.09, 0.39, 0]}>
            <boxGeometry args={[0.14, 0.78, 0.15]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.09, 0.39, 0]}>
            <boxGeometry args={[0.14, 0.78, 0.15]} />
            <meshLambertMaterial color={pantsColor} />
          </mesh>
          {/* Sepatu/Sandal */}
          <mesh position={[-0.09, 0.03, 0.03]}>
            <boxGeometry args={[0.14, 0.06, 0.21]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.09, 0.03, 0.03]}>
            <boxGeometry args={[0.14, 0.06, 0.21]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
        </>
      )}

      {/* --- BADAN / BAJU --- */}
      <mesh position={[0, torsoY, 0]}>
        <boxGeometry args={[0.38, 0.52, 0.22]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>

      {/* Tas Ransel (untuk pelajar) */}
      {hasBackpack && (
        <mesh position={[0, torsoY + 0.02, -0.15]}>
          <boxGeometry args={[0.28, 0.36, 0.12]} />
          <meshLambertMaterial color="#1d4ed8" />
        </mesh>
      )}

      {/* --- LENGAN KIRI & KANAN --- */}
      <mesh
        position={[-0.24, torsoY - 0.02, isSitting || hasPhone ? 0.1 : 0]}
        rotation={[isSitting || hasPhone ? -0.65 : 0, 0, 0]}
      >
        <boxGeometry args={[0.1, 0.44, 0.11]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      <mesh
        position={[0.24, torsoY - 0.02, isSitting || hasPhone ? 0.14 : 0]}
        rotation={[hasPhone ? -1.05 : isSitting ? -0.65 : 0, 0, 0]}
      >
        <boxGeometry args={[0.1, 0.44, 0.11]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>

      {/* HP saat scan QRIS / baca materi */}
      {hasPhone && (
        <mesh position={[0.2, torsoY + 0.04, 0.32]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.07, 0.13, 0.015]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
      )}

      {/* --- KEPALA --- */}
      <mesh position={[0, headY, 0]}>
        <sphereGeometry args={[0.135, 12, 12]} />
        <meshLambertMaterial color={skinColor} />
      </mesh>

      {/* Aksesori Kepala: Peci / Hijab / Topi */}
      {headwear === 'peci' && (
        <mesh position={[0, headY + 0.09, 0]}>
          <cylinderGeometry args={[0.125, 0.135, 0.11, 12]} />
          <meshLambertMaterial color="#111827" />
        </mesh>
      )}
      {headwear === 'cap' && (
        <group position={[0, headY + 0.08, 0]}>
          <mesh>
            <sphereGeometry args={[0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshLambertMaterial color="#0f766e" />
          </mesh>
          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[0.18, 0.02, 0.12]} />
            <meshLambertMaterial color="#0f766e" />
          </mesh>
        </group>
      )}
      {headwear === 'hijab' && (
        <group position={[0, headY, 0]}>
          {/* Penutup Kepala & Leher */}
          <mesh position={[0, 0.02, -0.02]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshLambertMaterial color={hijabColor} />
          </mesh>
          {/* Kerudung Menutup Dada */}
          <mesh position={[0, -0.18, 0.04]}>
            <boxGeometry args={[0.3, 0.24, 0.2]} />
            <meshLambertMaterial color={hijabColor} />
          </mesh>
        </group>
      )}
      {headwear === 'none' && (
        <mesh position={[0, headY + 0.05, -0.02]}>
          <sphereGeometry args={[0.142, 10, 10]} />
          <meshLambertMaterial color="#1f2937" />
        </mesh>
      )}
    </group>
  );
}

/**
 * Figur Lansia di Kursi Roda (Khusus Zona Sosial / Ramp Landai)
 */
function WheelchairUser({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Kursi Roda */}
      {/* 2 Roda Besar Kiri & Kanan */}
      {[-0.31, 0.31].map((xW, idx) => (
        <group key={idx} position={[xW, 0.3, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.045, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}
      {/* 2 Roda Kecil Depan */}
      {[-0.24, 0.24].map((xF, idx) => (
        <mesh key={idx} position={[xF, 0.09, 0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.035, 10]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}
      {/* Dudukan & Sandaran */}
      <mesh position={[0, 0.44, 0.02]}>
        <boxGeometry args={[0.5, 0.06, 0.46]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.72, -0.18]}>
        <boxGeometry args={[0.5, 0.52, 0.05]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      {/* Pegangan Dorong Belakang */}
      {[-0.22, 0.22].map((xH, idx) => (
        <mesh key={idx} position={[xH, 0.96, -0.26]}>
          <boxGeometry args={[0.04, 0.04, 0.16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} />
        </mesh>
      ))}

      {/* Lansia Duduk di Kursi Roda */}
      <StylizedPerson
        position={[0, 0.46, 0.04]}
        shirtColor="#e2e8f0"
        pantsColor="#475569"
        headwear="peci"
        pose="sitting"
        scale={0.96}
      />
    </group>
  );
}

/* ============================================================================
   3. KOMPONEN UTAMA: WARGA, JAMAAH & KENDARAAN DI SEKITAR MUSHOLLA
   Sinkron 1:1 dengan koordinat Neighborhood, BeforeMusholla, & AfterMusholla
   ============================================================================ */

export default function CharactersAndVehicles({ mode = 'before', isNight = false, visible = true }) {
  if (!visible) return null;

  const isAfter = mode === 'after';

  return (
    <group name="characters-and-vehicles">
      {/* =====================================================================
          A. KENDARAAN DI JALAN (MEMBUKTIKAN AKSES GANG TETAP LEGA & LANCAR!)
          ===================================================================== */}
      {/* 1. Mobil MPV di Gang Kiri Jl. Bumi Bahagia (X = -8.6, lebar gang 4m: X = -10.5 s/d -6.5) */}
      <LowPolyCar
        position={[-8.6, 0, -2.8]}
        rotationY={0}
        bodyColor="#cbd5e1"
        isNight={isNight}
        isSUV={true}
      />

      {/* 2. Mobil Sedan/City Car melintas di Jalan Pertigaan Depan sisi kanan */}
      <LowPolyCar
        position={[10.5, 0.01, 8.8]}
        rotationY={-Math.PI / 2}
        bodyColor="#1e3a8a"
        isNight={isNight}
        isSUV={false}
      />

      {/* 3. Sepeda Motor Harian Jamaah (Before: dekat gerbang kanan | After: parkir tepi kanan luar teras) */}
      <LowPolyMotorbike
        position={isAfter ? [8.1, 0, 2.5] : [6.25, 0, 1.8]}
        rotationY={isAfter ? Math.PI : -Math.PI / 2}
        bodyColor="#991b1b"
      />

      {/* =====================================================================
          B. JAMAAH DI DALAM RUANG SHOLAT (MODE BEFORE & AFTER)
          ===================================================================== */}
      {/* Jamaah Pria Duduk Berdzikir/Mengaji Menghadap Kiblat (+Z) di Shaf Depan */}
      <StylizedPerson
        position={[-0.1, 0.37, 1.5]}
        rotationY={0}
        shirtColor="#f8fafc"
        pantsColor="#14532d"
        headwear="peci"
        pose="praying_sit"
      />

      {/* Jamaah Pria Masuk dari Pintu Kanan Ruang Sholat */}
      <StylizedPerson
        position={[1.75, 0.37, 0.1]}
        rotationY={-Math.PI * 0.65}
        shirtColor="#1e3a8a"
        pantsColor="#334155"
        headwear="peci"
        pose="standing"
      />

      {/* =====================================================================
          C. AKTIVITAS WARGA SESUAI MODE (BEFORE vs AFTER REIMAGINE)
          ===================================================================== */}
      {isAfter ? (
        <>
          {/* 1. ZONA PENDIDIKAN: 2 Pelajar Belajar & Mengaji di Meja Teras Dek Kayu */}
          {/* Pelajar 1 di bangku kiri (X = 4.05, Z = -0.45) menghadap laptop */}
          <StylizedPerson
            position={[4.05, 0.8, -0.45]}
            rotationY={Math.PI / 2}
            scale={0.86}
            shirtColor="#38bdf8"
            pantsColor="#1e293b"
            headwear="peci"
            pose="sitting"
            hasBackpack={true}
          />
          {/* Pelajar 2 (Berhijab) di bangku kanan (X = 5.15, Z = 0.45) menghadap laptop */}
          <StylizedPerson
            position={[5.15, 0.8, 0.45]}
            rotationY={-Math.PI / 2}
            scale={0.86}
            shirtColor="#fef3c7"
            pantsColor="#334155"
            headwear="hijab"
            hijabColor="#059669"
            pose="sitting"
          />

          {/* 2. ZONA SOSIAL: Lansia Kursi Roda di Ramp Landai + Warga di Kulkas Berbagi */}
          <WheelchairUser position={[4.0, 0.01, 6.7]} rotationY={Math.PI} />
          {/* Relawan Muda Mendampingi Lansia */}
          <StylizedPerson
            position={[4.68, 0.01, 6.45]}
            rotationY={Math.PI * 0.85}
            shirtColor="#10b981"
            pantsColor="#1e293b"
            headwear="none"
            pose="standing"
          />
          {/* Ibu Berhijab Mengambil/Menaruh Makanan di Kulkas Berbagi (Z = 2.5) */}
          <StylizedPerson
            position={[4.1, 0.36, 3.35]}
            rotationY={Math.PI}
            scale={0.94}
            shirtColor="#f5d0fe"
            pantsColor="#475569"
            headwear="hijab"
            hijabColor="#9333ea"
            pose="standing"
          />

          {/* 3. ZONA EKONOMI: Pedagang Sarapan & Warga Scan QRIS di Gerobak UMKM */}
          {/* Pedagang Gerobak 1 (Z = -5.2) */}
          <StylizedPerson
            position={[4.02, 0.36, -5.15]}
            rotationY={Math.PI / 2}
            shirtColor="#f97316"
            pantsColor="#1e293b"
            headwear="cap"
            pose="standing"
          />
          {/* Pembeli Warga Memegang HP Scan QRIS */}
          <StylizedPerson
            position={[5.68, 0.36, -5.45]}
            rotationY={-Math.PI / 2}
            shirtColor="#e2e8f0"
            pantsColor="#0f172a"
            headwear="none"
            pose="standing"
            hasPhone={true}
          />
        </>
      ) : (
        /* MODE BEFORE: Warga Berjalan Kaki di Pinggir Jl. Bumi Bahagia */
        <StylizedPerson
          position={[-7.65, 0, 1.4]}
          rotationY={Math.PI}
          shirtColor="#e2e8f0"
          pantsColor="#334155"
          headwear="peci"
          pose="standing"
        />
      )}

      {/* =====================================================================
          D. WARGA LINGKUNGAN KAMPUNG/DESA DAMAI (DI POS RONDA, GANG, & HALAMAN)
          ===================================================================== */}
      {/* 2 Warga Ngobrol Santai di Dekat Pos Ronda Kiri (X = -11.6..-12.2, Z = 2.0) */}
      <StylizedPerson
        position={[-11.4, 0, 2.2]}
        rotationY={-Math.PI / 2}
        shirtColor="#10b981"
        pantsColor="#1e293b"
        headwear="peci"
        pose="standing"
      />
      <StylizedPerson
        position={[-12.2, 0.48, 1.35]}
        rotationY={Math.PI / 2}
        shirtColor="#fef3c7"
        pantsColor="#334155"
        headwear="cap"
        pose="sitting"
      />

      {/* 2 Ibu Tetangga Berhijab Ngobrol di Pinggir Gang Kanan */}
      <StylizedPerson
        position={[7.9, 0, -4.6]}
        rotationY={Math.PI}
        shirtColor="#fbcfe8"
        pantsColor="#334155"
        headwear="hijab"
        hijabColor="#be185d"
        pose="standing"
      />
      <StylizedPerson
        position={[8.0, 0, -5.45]}
        rotationY={0}
        shirtColor="#dbeafe"
        pantsColor="#1e293b"
        headwear="hijab"
        hijabColor="#0284c7"
        pose="standing"
      />

      {/* Anak-Anak Bermain / Jalan di Gang Jl. Bumi Bahagia & Gang Barat */}
      <StylizedPerson
        position={[-9.6, 0, -7.2]}
        rotationY={0.25}
        scale={0.78}
        shirtColor="#facc15"
        pantsColor="#1e293b"
        headwear="none"
        pose="standing"
      />
      <StylizedPerson
        position={[-19.6, 0, -3.5]}
        rotationY={Math.PI * 0.8}
        scale={0.82}
        shirtColor="#38bdf8"
        pantsColor="#334155"
        headwear="cap"
        pose="standing"
        hasBackpack={true}
      />

      {/* Warga di Gang Timur & Halaman Rumah Seberang Depan */}
      <StylizedPerson
        position={[18.9, 0, -7.8]}
        rotationY={Math.PI / 4}
        shirtColor="#f8fafc"
        pantsColor="#475569"
        headwear="peci"
        pose="standing"
      />
      <StylizedPerson
        position={[-4.2, 0, 17.6]}
        rotationY={Math.PI}
        shirtColor="#a7f3d0"
        pantsColor="#1e293b"
        headwear="hijab"
        hijabColor="#047857"
        pose="standing"
      />
    </group>
  );
}
