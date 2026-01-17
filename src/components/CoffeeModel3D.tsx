'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function CoffeePackage() {
    const meshRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF('/assets/3dmodel/package2.glb');

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={meshRef} dispose={null} position={[1, -2.5, 0]}>
            <primitive object={scene} scale={1.65} />
        </group>
    );
}

export default function CoffeeModel3D() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas
                camera={{ position: [0, 0, 11], fov: 40 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: 'low-power' }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[0, 0, 10]} intensity={2} />
                <pointLight position={[5, 5, 5]} intensity={1} />

                <CoffeePackage />

            </Canvas>
        </div>
    );
}

useGLTF.preload('/assets/3dmodel/package2.glb');
