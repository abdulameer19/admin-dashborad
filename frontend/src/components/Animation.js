import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

const ParticleSystem = () => {
    const particlesRef = useRef();
    const { camera } = useThree();
    const mouse = useRef(new THREE.Vector2());
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const particles = useMemo(() => {
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        const radius = 15; // Adjust the radius if needed

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * radius;
            const y = (Math.random() - 0.5) * 10;
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * radius;

            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;

            particleColors[i * 3] = 0.2;
            particleColors[i * 3 + 1] = 0.2;
            particleColors[i * 3 + 2] = 0.2;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        return particlesGeometry;
    }, []);

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.005;
        }

        raycaster.setFromCamera(mouse.current, camera);
        const intersects = raycaster.intersectObject(particlesRef.current);

        if (intersects.length > 0) {
            const index = intersects[0].index;
            const position = particles.attributes.position;
            const colors = particles.attributes.color;

            for (let i = 0; i < position.count; i++) {
                const distance = Math.sqrt(
                    (position.array[index * 3] - position.array[i * 3]) ** 2 +
                    (position.array[index * 3 + 1] - position.array[i * 3 + 1]) ** 2 +
                    (position.array[index * 3 + 2] - position.array[i * 3 + 2]) ** 2
                );
                if (distance < 2) {
                    colors.array[i * 3] = 1;
                    colors.array[i * 3 + 1] = 0.2;
                    colors.array[i * 3 + 2] = 0.2;
                } else {
                    colors.array[i * 3] = 0.2;
                    colors.array[i * 3 + 1] = 0.2;
                    colors.array[i * 3 + 2] = 0.2;
                }
            }
            colors.needsUpdate = true;
        }
    });

    const handleMouseMove = (event) => {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <points ref={particlesRef} geometry={particles}>
            <pointsMaterial vertexColors size={0.5} />
        </points>
    );
};

const Controls = () => {
    const { camera, gl } = useThree();
    const ref = useRef();
    useFrame(() => ref.current.update());
    return <orbitControls ref={ref} args={[camera, gl.domElement]} />;
};

const Apps = () => {
    return (
        <Canvas camera={{ position: [0, 15, 40] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 7.5]} intensity={1} />
            <ParticleSystem />
            <Controls />
        </Canvas>
    );
};

export default Apps;
