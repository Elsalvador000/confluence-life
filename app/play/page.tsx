"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Keyboard tracking ---------- */
function useKeyboard() {
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => {
    function down(e: KeyboardEvent) {
      keys.current[e.key.toLowerCase()] = true;
    }
    function up(e: KeyboardEvent) {
      keys.current[e.key.toLowerCase()] = false;
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

/* ---------- Buildings ---------- */
function Building({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#8b6b3d" />
    </mesh>
  );
}

function River() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, 0.02, 0]}>
      <planeGeometry args={[40, 200]} />
      <meshStandardMaterial color="#3b82c4" />
    </mesh>
  );
}

/* ---------- Player ---------- */
// The joystick value is stored in a mutable ref so Player can read it
// every frame without causing React re-renders.
type JoystickRef = { x: number; y: number };

function Player({
  joystickRef,
}: {
  joystickRef: React.MutableRefObject<JoystickRef>;
}) {
  const group = useRef<THREE.Group>(null);
  const keys = useKeyboard();

  useFrame((state, delta) => {
    if (!group.current) return;

    const speed = 10;
    let dx = 0;
    let dz = 0;

    // Keyboard input
    if (keys.current["w"] || keys.current["arrowup"]) dz -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) dz += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) dx -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) dx += 1;

    // Joystick input (adds to keyboard)
    dx += joystickRef.current.x;
    dz += joystickRef.current.y;

    // Normalise so diagonal movement isn't faster
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len > 1) {
      dx /= len;
      dz /= len;
    }

    group.current.position.x += dx * speed * delta;
    group.current.position.z += dz * speed * delta;

    group.current.position.x = Math.max(
      -60,
      Math.min(60, group.current.position.x)
    );
    group.current.position.z = Math.max(
      -60,
      Math.min(60, group.current.position.z)
    );

    if (dx !== 0 || dz !== 0) {
      group.current.rotation.y = Math.atan2(dx, dz);
    }

    const px = group.current.position.x;
    const pz = group.current.position.z;
    state.camera.position.lerp(new THREE.Vector3(px + 8, 10, pz + 8), 0.08);
    state.camera.lookAt(px, 2, pz);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.2, 4, 12]} />
        <meshStandardMaterial color="#2b1008" />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.4, 0.45]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
    </group>
  );
}

/* ---------- Joystick (mobile only) ---------- */
function Joystick({
  joystickRef,
}: {
  joystickRef: React.MutableRefObject<JoystickRef>;
}) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const padRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  const PAD_SIZE = 140;
  const MAX = 50;

  function setFromPointer(clientX: number, clientY: number) {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX) {
      dx = (dx / dist) * MAX;
      dy = (dy / dist) * MAX;
    }

    setKnob({ x: dx, y: dy });

    // Normalise to -1..1 for the game
    joystickRef.current.x = dx / MAX;
    joystickRef.current.y = dy / MAX;
  }

  function onDown(e: React.PointerEvent) {
    activeRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
  }
  function onMove(e: React.PointerEvent) {
    if (!activeRef.current) return;
    setFromPointer(e.clientX, e.clientY);
  }
  function onUp() {
    activeRef.current = false;
    setKnob({ x: 0, y: 0 });
    joystickRef.current.x = 0;
    joystickRef.current.y = 0;
  }

  return (
    <div
      ref={padRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ width: PAD_SIZE, height: PAD_SIZE }}
      className="relative rounded-full bg-white/30 border-2 border-white/60 backdrop-blur select-none touch-none"
    >
      <div
        className="absolute w-16 h-16 rounded-full bg-white shadow-lg pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
}

export default function PlayPage() {
  const joystickRef = useRef({ x: 0, y: 0 });

  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden">
      <Canvas shadows camera={{ position: [8, 10, 8], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Sky sunPosition={[100, 30, 100]} />

        <Ground />
        <River />

        <Building position={[6, 2, -4]} color="#d18d4c" size={[4, 4, 4]} />
        <Building position={[-8, 3, 5]} color="#a56030" size={[6, 6, 5]} />
        <Building position={[12, 3, 8]} color="#c97a3d" size={[5, 6, 5]} />
        <Building position={[-4, 2, -10]} color="#b5764a" size={[4, 4, 4]} />
        <Building position={[14, 4, -12]} color="#8b4a1e" size={[6, 8, 6]} />
        <Building position={[2, 1.5, 14]} color="#d1a06c" size={[3, 3, 3]} />

        <Player joystickRef={joystickRef} />
      </Canvas>

      {/* Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
          Lokoja · Kogi State
        </p>
        <p className="text-sm font-bold text-stone-900">Confluence Life</p>
      </div>

      {/* Joystick — bottom-left, mobile only */}
      <div className="absolute bottom-6 left-6 md:hidden">
        <Joystick joystickRef={joystickRef} />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-full px-5 py-2.5 shadow-lg text-xs font-medium text-stone-700 text-center pointer-events-none">
        <span className="hidden md:inline">
          <b>W A S D</b> or arrow keys to walk
        </span>
        <span className="md:hidden">Use the joystick to walk</span>
      </div>
    </main>
  );
}