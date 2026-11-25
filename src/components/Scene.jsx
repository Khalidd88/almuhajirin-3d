import React, { useMemo, useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { XR, createXRStore, XROrigin, useXRControllerLocomotion } from '@react-three/xr';
import * as THREE from 'three';

import Neighborhood from './Neighborhood';
import BeforeMusholla from './BeforeMusholla';
import AfterMusholla from './AfterMusholla';
import InteriorSpace from './InteriorSpace';
import WindSimulation from './WindSimulation';
import CharactersAndVehicles from './CharactersAndVehicles';

/* ============================================================================
   1. XR STORE (Bisa di-import di App.jsx / HUD.jsx untuk tombol Masuk VR)
   ============================================================================ */
export const xrStore = createXRStore({
  offerSession: false,
});

/* ============================================================================
   2. PRESET KAMERA (SINKRON 1:1 DENGAN SKALA GOOGLE EARTH 14m x 20m)
   ============================================================================ */
export const CAMERA_PRESETS = {
  // Sudut default persis Google Street View Jl. Bumi Bahagia
  ikhtisar: {
    position: [5.4, 2.55, 13.8],
    target: [0.2, 2.0, -2.5],
  },
  // Masuk ke dalam Ruang Sholat Utama (menghadap Mihrab & Kiblat)
  ibadah: {
    position: [1.4, 1.75, -2.8],
    target: [-0.8, 1.55, 3.6],
  },
  // Area Wudhu & WC di bagian dalam belakang sesuai denah
  wudhu: {
    position: [-2.4, 1.7, -5.2],
    target: [-5.6, 1.1, -6.5],
  },
  // Teras Kayu & Meja Belajar (bawah kanopi kanan depan)
  pendidikan: {
    position: [6.2, 1.9, 3.5],
    target: [4.2, 1.1, -0.5],
  },
  // Kulkas Berbagi & Ramp Lansia (depan teras kanan)
  sosial: {
    position: [6.8, 1.85, 6.2],
    target: [3.8, 1.1, 2.2],
  },
  // Gerobak UMKM Sarapan Warga (tengah-belakang bawah kanopi)
  ekonomi: {
    position: [6.4, 1.9, -1.5],
    target: [4.5, 1.1, -6.5],
  },
  // Smart TV Digital & Panel Surya
  digital: {
    position: [6.2, 2.2, 2.6],
    target: [3.1, 2.1, 2.0],
  },
  // Tampak Atas (Drone View buat cek denah 281 m2 + 2 rumah + gang belok)
  atas: {
    position: [14.0, 22.0, 18.0],
    target: [-1.0, 0.5, -8.0],
  },
};

/* ============================================================================
   3. CAMERA RIG (ORBIT + PRESET LERP + WASD/ARROW KEYS + JOYSTICK HP)
   ============================================================================ */
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function VRLocomotionRig({ originRef, activePreset = 'ikhtisar' }) {
  useXRControllerLocomotion(originRef, { speed: 4.0 }, { type: 'snap', degrees: 30 });

  useEffect(() => {
    if (!originRef.current) return;
    const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.ikhtisar;
    originRef.current.position.set(preset.position[0], 0, preset.position[2]);
  }, [activePreset, originRef]);

  return (
    <XROrigin
      ref={originRef}
      position={[CAMERA_PRESETS.ikhtisar.position[0], 0, CAMERA_PRESETS.ikhtisar.position[2]]}
    />
  );
}

function CameraRig({ activePreset = 'ikhtisar', presetTrigger = 0, joystickRef, xrOriginRef }) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const isTransitioning = useRef(false);

  const targetPos = useRef(new THREE.Vector3(...CAMERA_PRESETS.ikhtisar.position));
  const targetLook = useRef(new THREE.Vector3(...CAMERA_PRESETS.ikhtisar.target));

  // Status tombol keyboard WASD / Arrow / Shift (zero re-render)
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  // Vector reusable untuk menghindari GC setiap frame
  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveVec = useRef(new THREE.Vector3());

  // Listener keyboard WASD & Panah untuk laptop/desktop
  useEffect(() => {
    const updateKey = (code, pressed) => {
      const k = keysRef.current;
      if (code === 'KeyW' || code === 'ArrowUp') k.forward = pressed;
      else if (code === 'KeyS' || code === 'ArrowDown') k.backward = pressed;
      else if (code === 'KeyA' || code === 'ArrowLeft') k.left = pressed;
      else if (code === 'KeyD' || code === 'ArrowRight') k.right = pressed;
      else if (code === 'ShiftLeft' || code === 'ShiftRight') k.sprint = pressed;
    };

    const onKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      updateKey(e.code, true);
    };
    const onKeyUp = (e) => updateKey(e.code, false);
    const onBlur = () => {
      keysRef.current = { forward: false, backward: false, left: false, right: false, sprint: false };
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // Trigger transisi halus setiap kali preset berubah atau tombol preset diklik
  useEffect(() => {
    const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.ikhtisar;
    targetPos.current.set(...preset.position);
    targetLook.current.set(...preset.target);
    isTransitioning.current = true;
  }, [activePreset, presetTrigger]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // 1. Hitung input jalan dari Keyboard (WASD/Panah) + Joystick Sentuh (HP)
    const k = keysRef.current;
    const keyForward = (k.forward ? 1 : 0) - (k.backward ? 1 : 0);
    const keyRight = (k.right ? 1 : 0) - (k.left ? 1 : 0);

    const joyX = joystickRef?.current?.x || 0;
    const joyY = joystickRef?.current?.y || 0;

    const inputForward = THREE.MathUtils.clamp(keyForward + joyY, -1, 1);
    const inputRight = THREE.MathUtils.clamp(keyRight + joyX, -1, 1);

    if (Math.abs(inputForward) > 0.02 || Math.abs(inputRight) > 0.02) {
      isTransitioning.current = false;

      // Arah hadap horizontal kamera di bidang XZ
      camera.getWorldDirection(forwardVec.current);
      forwardVec.current.y = 0;
      if (forwardVec.current.lengthSq() > 0.0001) {
        forwardVec.current.normalize();
      } else {
        forwardVec.current.set(0, 0, -1);
      }
      rightVec.current.crossVectors(forwardVec.current, WORLD_UP).normalize();

      const speed = k.sprint ? 8.2 : 4.4;
      moveVec.current
        .set(0, 0, 0)
        .addScaledVector(forwardVec.current, inputForward)
        .addScaledVector(rightVec.current, inputRight);

      if (moveVec.current.lengthSq() > 1) {
        moveVec.current.normalize();
      }
      moveVec.current.multiplyScalar(speed * dt);

      if (gl.xr.isPresenting && xrOriginRef?.current) {
        // Saat mode VR aktif: gerakkan XROrigin
        xrOriginRef.current.position.add(moveVec.current);
        xrOriginRef.current.position.x = THREE.MathUtils.clamp(xrOriginRef.current.position.x, -40, 40);
        xrOriginRef.current.position.z = THREE.MathUtils.clamp(xrOriginRef.current.position.z, -46, 36);
      } else if (controlsRef.current) {
        // Mode 3D biasa (Desktop/HP): geser kamera + target OrbitControls bersama-sama
        camera.position.add(moveVec.current);
        controlsRef.current.target.add(moveVec.current);

        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -40, 40);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -46, 36);
        camera.position.y = Math.max(0.45, camera.position.y);
        controlsRef.current.target.x = THREE.MathUtils.clamp(controlsRef.current.target.x, -40, 40);
        controlsRef.current.target.z = THREE.MathUtils.clamp(controlsRef.current.target.z, -46, 36);
        controlsRef.current.update();
      }
      return;
    }

    // 2. Animasi lerp preset kamera jika sedang transisi
    if (!isTransitioning.current || !controlsRef.current) return;

    const step = 1 - Math.exp(-delta * 4.5);
    camera.position.lerp(targetPos.current, step);
    controlsRef.current.target.lerp(targetLook.current, step);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetPos.current) < 0.05 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.05
    ) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={CAMERA_PRESETS.ikhtisar.target}
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.75}
      zoomSpeed={0.9}
      panSpeed={0.8}
      minDistance={1.2}
      maxDistance={46}
      maxPolarAngle={Math.PI / 2 - 0.03} // Supaya kamera tidak tembus ke bawah tanah
      onStart={() => {
        // Begitu user sentuh/geser, hentikan auto-lerp agar kontrol bebas
        isTransitioning.current = false;
      }}
    />
  );
}

/* ============================================================================
   4. LIGHTING & ATMOSPHERE (SORE ASHAR HANGAT vs MALAM ISYA)
   ============================================================================ */
function EnvironmentLighting({ isNight, isMobile }) {
  const shadowSize = isMobile ? 512 : 1024;

  return (
    <>
      {/* Warna Langit & Fog Horizon yang menyatu dengan base ground Neighborhood */}
      <color attach="background" args={[isNight ? '#0a1020' : '#cfe0f2']} />
      <fog attach="fog" args={[isNight ? '#0a1020' : '#cfe0f2', 28, 86]} />

      {/* Bintang di Langit saat Mode Malam */}
      {isNight && (
        <Stars
          radius={65}
          depth={25}
          count={isMobile ? 350 : 700}
          factor={2.4}
          saturation={0.1}
          fade
          speed={0.3}
        />
      )}

      {/* Cahaya Ambien & Hemisphere Ringan */}
      <ambientLight intensity={isNight ? 0.28 : 0.52} color={isNight ? '#7c96c2' : '#fff8ee'} />
      <hemisphereLight
        args={[
          isNight ? '#1e2f4f' : '#dbeafe',
          isNight ? '#14181f' : '#8a7e6e',
          isNight ? 0.38 : 0.68,
        ]}
      />

      {/* 1 DirectionalLight Utama dengan Shadow Frustum Terpusat pada Musholla & Jalan (Ultra Mulus 60 FPS!) */}
      <directionalLight
        position={isNight ? [-12, 18, 10] : [16, 15, 12]}
        intensity={isNight ? 0.45 : 1.8}
        color={isNight ? '#93b4e8' : '#ffe4be'}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
    </>
  );
}

/* ============================================================================
   5. KOMPONEN UTAMA: SCENE
   Mendukung berbagai nama prop dari App.jsx agar langsung jalan tanpa bentrok:
   - mode: 'before' | 'after'
   - isNight (boolean) ATAU timeOfDay ('sore' | 'malam' | 'afternoon' | 'night' | 'isya')
   - activePreset / cameraPreset: key dari CAMERA_PRESETS
   - store: opsional custom xrStore
   ============================================================================ */
export default function Scene({
  mode = 'before',
  isNight,
  timeOfDay,
  activePreset,
  cameraPreset,
  presetTrigger = 0,
  windSimulation = false,
  showCrowd = true,
  joystickRef,
  store = xrStore,
  children,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const xrOriginRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const night = useMemo(() => {
    if (typeof isNight === 'boolean') return isNight;
    return timeOfDay === 'night' || timeOfDay === 'malam' || timeOfDay === 'isya';
  }, [isNight, timeOfDay]);

  const currentPreset = activePreset || cameraPreset || 'ikhtisar';

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        dpr={isMobile ? [1, 1] : [1, 1.25]}
        performance={{ min: 0.6 }}
        camera={{
          position: CAMERA_PRESETS.ikhtisar.position,
          fov: isMobile ? 54 : 46,
          near: 0.1,
          far: 150,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: night ? 1.08 : 1.0,
        }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      >
        <XR store={store}>
          <EnvironmentLighting isNight={night} isMobile={isMobile} />
          <VRLocomotionRig originRef={xrOriginRef} activePreset={currentPreset} />
          <CameraRig
            activePreset={currentPreset}
            presetTrigger={presetTrigger}
            joystickRef={joystickRef}
            xrOriginRef={xrOriginRef}
          />

          <Suspense fallback={null}>
            {/* Lingkungan Nyata Jl. Bumi Bahagia (Skala 1:1 Google Earth) */}
            <Neighborhood isNight={night} />

            {/* Interior Ruang Sholat, Gudang, Wudhu Pria/Wanita, WC, & Sandal */}
            <InteriorSpace mode={mode} isNight={night} />

            {/* Simulasi Aliran Angin Alami (Cross Ventilation) */}
            <WindSimulation enabled={Boolean(windSimulation)} isNight={night} />

            {/* Eksterior & Kanopi Musholla (Before vs After) */}
            {mode === 'before' ? (
              <BeforeMusholla isNight={night} />
            ) : (
              <AfterMusholla isNight={night} />
            )}

            {/* Warga, Jamaah & Kendaraan Low-Poly */}
            <CharactersAndVehicles mode={mode} isNight={night} visible={Boolean(showCrowd)} />

            {/* Slot tambahan (misal WindSimulation / SmartTV dari parent jika ada) */}
            {children}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}