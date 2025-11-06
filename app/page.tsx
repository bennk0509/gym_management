"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactTyped } from "react-typed";

/**
 * Concept 3 — "Time Tunnel Entrance" (Fixed)
 * Homepage with scroll-based fly-in through a glowing tunnel to reveal a barbell and intro section.
 * Built for Next.js + Tailwind + react-three-fiber.
 *
 * Deps:
 * npm i three @react-three/fiber @react-three/drei framer-motion react-typed
 */

function Tunnel() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.z += 0.0015;
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <torusGeometry args={[2, 0.6, 16, 100]} />
      <meshStandardMaterial
        color="#1d4ed8"
        emissive="#3b82f6"
        emissiveIntensity={0.8}
        metalness={1}
        roughness={0.3}
      />
    </mesh>
  );
}

function BarbellModel() {
  const { scene } = useGLTF("models/Barbellv2.glb");
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.15;
  });
  return <primitive ref={ref} object={scene} scale={1.3} position={[0, 0, 0]} />;
}

function FlyCamera() {
  const { camera } = useThree();
  const scroll = useScroll();
  const z = useTransform(scroll.scrollYProgress, [0, 1], [8, 0]);
  const y = useTransform(scroll.scrollYProgress, [0, 1], [1, 0]);

  useFrame(() => {
    camera.position.z = z.get();
    camera.position.y = y.get();
  });
  return null;
}

function SceneContent() {
  return (
    <group>
      <Float speed={1} rotationIntensity={0.3}>
        <BarbellModel />
      </Float>
      <Tunnel />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#60a5fa" />
      <Environment preset="city" />
    </group>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      {/* Hero Scroll Scene */}
      <section className="relative h-[200vh]">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={<Html center>Loading...</Html>}>
            <FlyCamera />
            <SceneContent />
          </Suspense>
        </Canvas>

        {/* Overlay Hero Text */}
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-6xl font-extrabold"
          >
            HT PRIVATE GYM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-4 text-lg sm:text-xl text-zinc-300"
          >
            <ReactTyped
              strings={["Where Focus Meets Strength", "Scroll to Begin Your Journey"]}
              typeSpeed={40}
              backSpeed={20}
              loop
            />
          </motion.p>
        </div>
      </section>

      {/* About Section after tunnel */}
      <section className="relative z-10 bg-[#0b0b0c] py-32 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-5xl font-bold"
        >
          Private Gym & Therapy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 max-w-3xl mx-auto text-zinc-300"
        >
          Trải nghiệm phòng tập và phục hồi cao cấp, nơi mọi chuyển động được thiết kế riêng cho bạn. Kết hợp công nghệ phân tích và huấn luyện cá nhân hoá.
        </motion.p>
        <div className="mt-10 flex justify-center gap-4">
          <motion.a
            href="#services"
            className="px-6 py-3 rounded-2xl bg-sky-500/90 hover:bg-sky-400 transition font-medium shadow-lg shadow-sky-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Services
          </motion.a>
          <motion.a
            href="#contact"
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-zinc-500 text-sm bg-black">
        © {new Date().getFullYear()} Private Gym & Therapy. All Rights Reserved.
      </footer>
    </main>
  );
}

useGLTF.preload("models/Barbellv2.glb");