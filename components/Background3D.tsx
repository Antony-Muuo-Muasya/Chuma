import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Icosahedron, Stars, Trail, TorusKnot, Ring } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null!);
  
  const sphere = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      
      const x = 20 * Math.sin(theta) * Math.cos(phi);
      const y = 20 * Math.sin(theta) * Math.sin(phi) * 0.6; 
      const z = 20 * Math.cos(theta);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Constant rotation
      ref.current.rotation.x += 0.0005;
      ref.current.rotation.y += 0.001;

      // Mouse interaction (Waves)
      const { x, y } = state.pointer;
      ref.current.rotation.x += y * 0.005;
      ref.current.rotation.y += x * 0.005;

      // Animation 1: Rhythmic Pulse (Simulating Bass)
      const beat = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1; // Fast beat
      ref.current.scale.setScalar(beat);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#E85D04"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

// Animation 2: Afro-Totem Artifact
const AfroTotem = () => {
    const ref = useRef<THREE.Group>(null!);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.2;
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={ref} position={[8, -4, -10]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <TorusKnot args={[1.5, 0.2, 100, 16]} material-wireframe>
                    <meshStandardMaterial color="#D4AF37" wireframe opacity={0.3} transparent />
                </TorusKnot>
                <Ring args={[2.5, 2.6, 32]} rotation={[Math.PI / 2, 0, 0]}>
                     <meshBasicMaterial color="#E85D04" side={THREE.DoubleSide} transparent opacity={0.4} />
                </Ring>
                <Ring args={[3.5, 3.6, 32]} rotation={[Math.PI / 2.2, 0, 0]}>
                     <meshBasicMaterial color="#E85D04" side={THREE.DoubleSide} transparent opacity={0.2} />
                </Ring>
            </Float>
        </group>
    )
}

// Animation 3: Mouse Trail
const MouseTrail = () => {
    const { viewport } = useThree();
    const ref = useRef<THREE.Mesh>(null!);
    
    useFrame((state) => {
        const { x, y } = state.pointer;
        // Convert screen space to 3D space roughly
        ref.current.position.x = (x * viewport.width) / 2;
        ref.current.position.y = (y * viewport.height) / 2;
    });

    return (
        <Trail width={2} color="#D4AF37" length={6} decay={1} attenuation={(t) => t * t}>
            <mesh ref={ref} position={[0, 0, 5]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#E85D04" visible={false} />
            </mesh>
        </Trail>
    )
}

// Animation 10: Particle Burst (Click Interaction)
const ClickBurst = () => {
    const [burst, setBurst] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);

    // Logic to expand a ring on click
    useFrame((state) => {
        if (groupRef.current) {
            if (burst) {
                groupRef.current.scale.addScalar(0.5);
                (groupRef.current.children[0].material as THREE.Material).opacity -= 0.02;
                if (groupRef.current.scale.x > 20) {
                    setBurst(false);
                    groupRef.current.scale.setScalar(0);
                    (groupRef.current.children[0].material as THREE.Material).opacity = 1;
                }
            }
        }
    });
    
    React.useEffect(() => {
        const handleClick = () => {
            setBurst(true);
            if (groupRef.current) {
                groupRef.current.scale.setScalar(1);
                (groupRef.current.children[0].material as THREE.Material).opacity = 1;
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <group ref={groupRef} scale={[0,0,0]}>
             <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4, 4.2, 64]} />
                <meshBasicMaterial color="#fff" transparent side={THREE.DoubleSide} />
             </mesh>
        </group>
    )
}

const CameraRig = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-chuma-black">
      <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
        <fog attach="fog" args={['#050505', 5, 30]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#D4AF37" />
        
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <ParticleField />
        <AfroTotem />
        <MouseTrail />
        <ClickBurst />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-chuma-black pointer-events-none" />
    </div>
  );
};

export default Background3D;