import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function ElonHead() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/lovable-uploads/efc313aa-5268-413f-bb28-d1bf3b1f6f9f.png');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export const ElonAvatar3D = () => {
  return (
    <div className="w-20 h-20 rounded-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ElonHead />
      </Canvas>
    </div>
  );
};