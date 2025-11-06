"use client";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null!);

  // Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.y = t * 0.4;
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />

      {/* Animated floating mesh */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={sphereRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <MeshDistortMaterial
            color="#FFC107"
            roughness={0.3}
            metalness={0.2}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>

      {/* Optional: interactive camera */}
      <OrbitControls enableZoom={false} />
    </>
  );
}
