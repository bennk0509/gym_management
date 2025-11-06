"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  Stars,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import { ReactTyped } from "react-typed";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";
import { animate } from "framer-motion";
import Barbell from "../models/Barbell";

const handleScroll = () => {
  const target = document.getElementById("about");
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY;
    animate(window.scrollY, y, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (val) => window.scrollTo(0, val),
    });
  }
};

function AnimatedSphere({
  mouseX,
  mouseY,
}: {
  mouseX: any;
  mouseY: any;
}) {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sphereRef.current.rotation.y = t * 0.5;
    sphereRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    sphereRef.current.position.x = mouseX.get() * 0.003;
    sphereRef.current.position.y = -mouseY.get() * 0.003;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <MeshDistortMaterial
          color="#FFC107"
          emissive="#FFC107"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.4}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const titleX = useTransform(smoothX, (v) => v * 0.02);
  const titleY = useTransform(smoothY, (v) => v * 0.02);
  const subtitleX = useTransform(smoothX, (v) => v * 0.015);
  const subtitleY = useTransform(smoothY, (v) => v * 0.015);
  const glowX = useTransform(smoothX, (v) => v * -0.01);
  const glowY = useTransform(smoothY, (v) => v * -0.01);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 🎥 3D Scene */}
      <div className="absolute inset-0 z-0">
      <div className="absolute z-10 top-1/3 left-20 text-white">
        <h1 className="text-5xl font-bold leading-tight">
          Transform your body with <span className="text-[#FFC107]">HT</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          We lead with quality in <span className="text-[#FFC107]">Performance</span>
        </p>
        <button className="mt-6 px-6 py-3 bg-[#FFC107] text-black font-semibold rounded-full shadow-lg hover:brightness-110">
          Learn More
        </button>
      </div>

      {/* Canvas section */}
      <Canvas
        camera={{ position: [2, 1, 3], fov: 45 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[3, 3, 2]} intensity={0.5} />
        <Environment preset="studio" />

        {/* Model */}
        <Barbell scale={0.6} position={[1.3, -0.3, 0]} />

        {/* OrbitControls chỉ cho phép xoay */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          rotateSpeed={0.6}
        />
      </Canvas>
      </div>

      {/* ✨ Overlay Glow */}
      <motion.div
        className="absolute inset-0 z-5 bg-gradient-to-b from-[#1E1E1E]/30 via-[#1E1E1E]/50 to-[#1E1E1E]/90"
        style={{ x: glowX, y: glowY }}
      />

      {/* 🩶 Text Layer */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start text-white px-8 md:px-20 font-poppins">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
          style={{ x: titleX, y: titleY }}
        >
          Transform your body with{" "}
          <motion.span
            className="text-[#FFC107]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            HT
          </motion.span>
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-4xl font-semibold text-gray-200 mt-4 drop-shadow"
          style={{ x: subtitleX, y: subtitleY }}
        >
          We lead with quality in{" "}
          <span>
            <ReactTyped
              className="pl-2 text-[#FFC107]"
              strings={[
                "PRIVATE GYM",
                "MASSAGE",
                "FITNESS COACHING",
              ]}
              typeSpeed={40}
              backSpeed={50}
              loop
              showCursor={false}
            />
          </span>
        </motion.h2>

        <button
          onClick={handleScroll}
          className="bg-[#FFC107] mt-8 text-[#1E1E1E] px-8 py-3 rounded-full hover:bg-white transition font-semibold tracking-wide shadow-lg"
        >
          Learn More
        </button>
      </div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFC107]/20 rounded-full blur-[150px] z-0" />
    </section>
  );
}
