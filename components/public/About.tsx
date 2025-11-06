"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

type CardData = {
  title: string;
  icon: string;
  description: string;
  color: string;
};

const cards: CardData[] = [
  {
    title: "Training",
    icon: "🏋️‍♂️",
    description: "Personalized strength sessions tailored to your goals and metrics.",
    color: "#38bdf8",
  },
  {
    title: "Therapy",
    icon: "💆‍♂️",
    description: "Recovery and body optimization powered by expert physiotherapists.",
    color: "#22d3ee",
  },
  {
    title: "Analytics",
    icon: "📊",
    description: "AI-driven performance tracking to refine every movement you make.",
    color: "#818cf8",
  },
  {
    title: "Community",
    icon: "🤝",
    description: "Train together, recover together — build lasting motivation.",
    color: "#f472b6",
  },
];

function AboutCard({ data }: { data: CardData }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [flipped, setFlipped] = useState(false);

  // gentle rotation animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current && !flipped) {
      mesh.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh
        ref={mesh}
        onClick={() => setFlipped(!flipped)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[2.5, 3.5, 0.2]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />

        <Html center transform>
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.8 }}
            className="w-[200px] h-[280px] rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center text-center shadow-lg [transform-style:preserve-3d]"
          >
            {!flipped ? (
              <div>
                <div className="text-5xl mb-3">{data.icon}</div>
                <h3 className="text-xl font-semibold text-white">
                  {data.title}
                </h3>
              </div>
            ) : (
              <div className="px-4 rotate-y-180">
                <p className="text-sm text-zinc-300">{data.description}</p>
              </div>
            )}
          </motion.div>
        </Html>
      </mesh>
    </Float>
  );
}

function AboutCardsScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.2} />
      <group position={[0, 0, 0]}>
        {cards.map((c, i) => (
          <AboutCard
            key={i}
            data={c}
          />
        ))}
      </group>
      <Environment preset="studio" />
    </>
  );
}

export default function AboutCardsSection() {
  return (
    <section
      id="about"
      className="relative h-[130vh] bg-[#0b0b0c] text-white flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12 z-10"
      >
        <h2 className="text-4xl sm:text-6xl font-extrabold">
          About <span className="text-sky-400">HT Private Gym</span>
        </h2>
        <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
          Strength, Recovery, and Balance — our 3D environment mirrors your
          growth path. Hover or tap each card to explore.
        </p>
      </motion.div>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <AboutCardsScene />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
