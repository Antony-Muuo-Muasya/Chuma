import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, Trail, MeshDistortMaterial, Text, Float
} from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// --- EFFECT 1: Warp Core (Theme Aware) ---
const WarpCore = ({ primaryColor }: { primaryColor: string }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[0, 0, 0]} scale={2.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={primaryColor} 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0} 
          metalness={0.1} 
          distort={0.4} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
};

// --- EFFECT 2: Glassmorphism Rings (Theme Aware) ---
const GlassRings = ({ accentColor }: { accentColor: string }) => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.5;
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 3, 0, 0]}>
      <mesh>
        <torusGeometry args={[4.5, 0.1, 16, 100]} />
        <meshPhysicalMaterial 
          color={accentColor} 
          transmission={0.6} 
          opacity={0.5} 
          metalness={0} 
          roughness={0} 
          ior={1.5} 
          thickness={2} 
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// --- EFFECT 3: Interactive Spotlight ---
const MouseLight = ({ color }: { color: string }) => {
  const light = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();
  
  useFrame((state) => {
    const { x, y } = state.pointer;
    light.current.position.x = (x * viewport.width) / 2;
    light.current.position.y = (y * viewport.height) / 2;
  });

  return <pointLight ref={light} position={[0, 0, 5]} intensity={2} color={color} distance={10} decay={2} />;
};

// --- EFFECT 4: Stardust Field ---
const StarField = () => {
  const ref = useRef<THREE.Points>(null!);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y -= 0.0002;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// --- EFFECT 5: Rhythmic Grid ---
const RhythmicGrid = ({ color }: { color: string }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (mesh.current) mesh.current.position.y = -4 + Math.sin(state.clock.elapsedTime) * 0.2;
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[40, 40, 40, 40]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
        </mesh>
    )
}

// --- EFFECT 6: Floating Crystals ---
const FloatingCrystals = ({ color }: { color: string }) => {
    return (
        <group>
            {Array.from({ length: 8 }).map((_, i) => {
                const x = (Math.random() - 0.5) * 20;
                const y = (Math.random() - 0.5) * 10;
                const z = (Math.random() - 0.5) * 10 - 5;
                return (
                    <Float key={i} speed={Math.random() * 2 + 1}>
                        <mesh position={[x, y, z]} scale={Math.random() * 0.5 + 0.2}>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshStandardMaterial color={color} roughness={0.2} metalness={1} />
                        </mesh>
                    </Float>
                )
            })}
        </group>
    )
}

// --- EFFECT 7: Cursor Trail ---
const CursorTrail = ({ color }: { color: string }) => {
    const { viewport } = useThree();
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const { x, y } = state.pointer;
        ref.current.position.x = (x * viewport.width) / 2;
        ref.current.position.y = (y * viewport.height) / 2;
    });
    return (
        <Trail width={3} color={color} length={5} decay={2}>
            <mesh ref={ref} position={[0, 0, 4]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color={color} visible={false} />
            </mesh>
        </Trail>
    )
}

// --- EFFECT 8: Kinetic Text ---
const FloatingLabels = ({ color }: { color: string }) => (
    <group>
        <Float speed={1.5} position={[-4, 3, -2]}>
                <Text color={color} fontSize={1} font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff">RHYTHM</Text>
        </Float>
            <Float speed={2} position={[4, -3, -2]}>
                <Text color={color} fontSize={1.5} font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff">SOUL</Text>
        </Float>
    </group>
);

// --- EFFECT 10: Camera Rig ---
const CameraRig = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 1.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Background3D: React.FC = () => {
  const { theme } = useTheme();

  // Define palette based on theme
  const primary = theme === 'dark' ? '#D4AF37' : '#2563eb'; // Gold vs Blue
  const secondary = theme === 'dark' ? '#E85D04' : '#9333ea'; // Orange vs Purple
  const bg = theme === 'dark' ? '#050505' : '#f0f0f0';

  return (
    <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: bg }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color={primary} />
        <fog attach="fog" args={[bg, 5, 25]} />

        <WarpCore primaryColor={primary} />
        <GlassRings accentColor={secondary} />
        <MouseLight color={primary} />
        <StarField />
        <RhythmicGrid color={secondary} />
        <FloatingCrystals color="#333" />
        <CursorTrail color={primary} />
        <FloatingLabels color={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
        <CameraRig />
      </Canvas>
      {/* Theme specific overlay */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-radial-gradient from-transparent to-black opacity-80' : 'bg-white/30'}`} />
    </div>
  );
};

export default Background3D;