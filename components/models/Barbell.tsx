"use client";
import { useGLTF } from "@react-three/drei";
import { JSX, useEffect } from "react";
import * as THREE from "three";

export default function Barbell(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/BARBELLv2.glb");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshToonMaterial({
          color: child.material.color || new THREE.Color("#FFC107"),
          gradientMap: null, // smooth cartoon
        });
        // child.material = new THREE.MeshStandardMaterial({
        //     color: child.material.color || new THREE.Color("#FFC107"),
        //     flatShading: true,
        //     metalness: 1,
        //     roughness: 1,
        //   });
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}
