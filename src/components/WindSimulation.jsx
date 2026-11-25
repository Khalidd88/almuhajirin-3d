import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * WindSimulation: Visualisasi Aliran Angin Alami (Cross Ventilation)
 * Menunjukkan udara sejuk masuk dari gang Jl. Bumi Bahagia (-X) melewati dinding roster terakota,
 * menyejukkan interior ruang sholat, dan keluar melalui pintu kaca geser ke teras dek kanan (+X).
 *
 * Menggunakan InstancedMesh partikel angin ramping yang bergerak mulus (60 FPS di HP).
 * SEMUA prop rotation wajib di mesh/group, BUKAN di dalam geometry!
 */
export default function WindSimulation({ enabled = true, isNight = false }) {
  const meshRef = useRef();
  const particleCount = 75;

  // Inisialisasi properti aliran udara untuk tiap partikel
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const yBase = 1.0 + (i % 6) * 0.35 + (Math.random() - 0.5) * 0.15;
      const zBase = -4.5 + ((i * 1.3) % 7.5) + (Math.random() - 0.5) * 0.4;
      const speed = 1.4 + (i % 5) * 0.25;
      const progress = Math.random();
      const waveOffset = Math.random() * Math.PI * 2;
      const scale = 0.8 + Math.random() * 0.4;

      return { yBase, zBase, speed, progress, waveOffset, scale };
    });
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!enabled || !meshRef.current) return;

    // Batas lintasan: dari gang kiri (x = -9.2) tembus roster (x = -6.32) ke teras kanan (x = +5.6)
    const startX = -9.2;
    const endX = 5.6;
    const totalDist = endX - startX;

    particles.forEach((p, idx) => {
      p.progress += (delta * p.speed) / (totalDist * 0.85);
      if (p.progress > 1) {
        p.progress = 0;
      }

      const t = p.progress;
      const currentX = startX + t * totalDist;
      const currentY = p.yBase + Math.sin(t * Math.PI * 3 + p.waveOffset) * 0.08;
      const currentZ = p.zBase + Math.cos(t * Math.PI * 2 + p.waveOffset) * 0.14;

      dummy.position.set(currentX, currentY, currentZ);

      let alphaScale = Math.sin(t * Math.PI);
      alphaScale = Math.max(0.1, alphaScale);

      dummy.scale.set(1.4 * p.scale * alphaScale, 0.5 * alphaScale, 0.5 * alphaScale);
      dummy.rotation.set(0, 0, Math.sin(t * Math.PI * 3 + p.waveOffset) * 0.1);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <group name="wind-cross-ventilation">
      <instancedMesh
        ref={meshRef}
        args={[null, null, particleCount]}
        frustumCulled={false}
      >
        {/* Geometri ramping horizontal searah sumbu X (tanpa prop rotation di geometry!) */}
        <boxGeometry args={[0.42, 0.024, 0.024]} />
        <meshBasicMaterial
          color={isNight ? '#7dd3fc' : '#38bdf8'}
          transparent
          opacity={isNight ? 0.45 : 0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Indikator Arah Angin di Tepi Gang Kiri */}
      <mesh position={[-8.5, 3.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.24, 6]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
