import React, { useRef, useState } from 'react';

/**
 * VirtualJoystick: Analog sentuh ringan untuk berjalan bebas di HP / Tablet (60 FPS).
 * Menulis langsung ke `joystickRef.current = { x, y }` tanpa memicu re-render React.
 * Mendukung multi-touch bersamaan dengan OrbitControls lewat Pointer Events.
 */
export default function VirtualJoystick({ joystickRef, visible = true }) {
  const baseRef = useRef(null);
  const pointerIdRef = useRef(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  if (!visible) return null;

  const maxRadius = 32;

  const updateFromClientPos = (clientX, clientY) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setKnobOffset({ x: dx, y: dy });

    if (joystickRef && joystickRef.current) {
      // x: kanan (+1) / kiri (-1), y: maju (+1 saat geser ke atas) / mundur (-1)
      joystickRef.current.x = dx / maxRadius;
      joystickRef.current.y = -dy / maxRadius;
    }
  };

  const resetStick = () => {
    pointerIdRef.current = null;
    setActive(false);
    setKnobOffset({ x: 0, y: 0 });
    if (joystickRef && joystickRef.current) {
      joystickRef.current.x = 0;
      joystickRef.current.y = 0;
    }
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    setActive(true);
    updateFromClientPos(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateFromClientPos(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    resetStick();
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="application"
      aria-label="Joystick Jalan"
      style={{ touchAction: 'none' }}
      className={`pointer-events-auto relative flex h-24 w-24 items-center justify-center rounded-full border backdrop-blur-md shadow-xl select-none transition-colors ${
        active
          ? 'bg-slate-900/80 border-emerald-400/60'
          : 'bg-slate-900/60 border-white/20'
      }`}
    >
      {/* Ring Panduan Arah */}
      <span className="pointer-events-none absolute top-1.5 text-[9px] font-bold text-slate-400/80">
        W
      </span>
      <span className="pointer-events-none absolute bottom-1.5 text-[9px] font-bold text-slate-400/80">
        S
      </span>
      <span className="pointer-events-none absolute left-2 text-[9px] font-bold text-slate-400/80">
        A
      </span>
      <span className="pointer-events-none absolute right-2 text-[9px] font-bold text-slate-400/80">
        D
      </span>

      {/* Thumb Knob Analog */}
      <div
        style={{
          transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
        }}
        className={`pointer-events-none h-10 w-10 rounded-full border shadow-md transition-transform duration-75 ${
          active
            ? 'bg-emerald-400 border-white/80 scale-105'
            : 'bg-emerald-500/85 border-emerald-200/60'
        }`}
      />
    </div>
  );
}
