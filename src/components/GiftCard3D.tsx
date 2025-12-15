"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        <RoundedBox args={[4, 2.5, 0.15]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial
            color="#8b5cf6"
            metalness={0.3}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[3.8, 2.3]} />
          <meshPhysicalMaterial
            color="#12121a"
            metalness={0.1}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>

        <mesh position={[1.3, -0.7, 0.1]}>
          <circleGeometry args={[0.25, 32]} />
          <MeshDistortMaterial color="#22c55e" speed={3} distort={0.3} />
        </mesh>

        <mesh position={[-1.3, 0.7, 0.1]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>

        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[1.5, 0.08, 0.01]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>

        <mesh position={[0, -0.3, 0.12]}>
          <boxGeometry args={[2.5, 0.05, 0.01]} />
          <meshStandardMaterial color="#a1a1aa" />
        </mesh>
        
        <mesh position={[0, 0.5, 0.12]}>
          <boxGeometry args={[1, 0.05, 0.01]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.03} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  );
}

export function GiftCard3D({ amount }: { amount?: number }) {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22c55e" />
        <spotLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
        <Card />
        <Particles />
      </Canvas>
    </div>
  );
}