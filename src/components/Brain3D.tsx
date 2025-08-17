import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// 量子光粒子组件
const QuantumParticles: React.FC = () => {
  const particleCount = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // 生成随机粒子位置和属性
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
      color: Math.random()
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      const time = clock.getElapsedTime();
      
      // 粒子运动轨迹
      const radius = 8 + Math.sin(time * particle.speed + particle.phase) * 3;
      const angle = time * particle.speed + particle.phase;
      
      tempObject.position.set(
        Math.cos(angle) * radius + particle.position[0] * 0.1,
        Math.sin(angle * 0.7) * radius + particle.position[1] * 0.1,
        Math.sin(angle) * radius + particle.position[2] * 0.1
      );
      
      // 粒子大小随时间变化
      const scale = 0.1 + Math.sin(time * 2 + particle.phase) * 0.05;
      tempObject.scale.setScalar(scale);
      
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // 动态颜色
      const hue = (particle.color + time * 0.1) % 1;
      tempColor.setHSL(hue, 1, 0.8);
      meshRef.current!.setColorAt(i, tempColor);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial 
        emissive={new THREE.Color(0x4477ff)}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
};

// 大脑主体结构
const BrainCore: React.FC = () => {
  const brainRef = useRef<THREE.Group>(null);
  const synapseRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      brainRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }

    // 神经突触闪烁效果
    synapseRefs.current.forEach((synapse, i) => {
      if (synapse && synapse.material) {
        const material = synapse.material as THREE.MeshStandardMaterial;
        const intensity = 0.5 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.5;
        material.emissiveIntensity = intensity;
      }
    });
  });

  return (
    <group ref={brainRef}>
      {/* 大脑主体 - 左半球 */}
      <Sphere args={[2.5, 32, 32]} position={[-1, 0, 0]}>
        <meshStandardMaterial
          color="#ff6b9d"
          metalness={0.3}
          roughness={0.4}
          emissive="#ff6b9d"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* 大脑主体 - 右半球 */}
      <Sphere args={[2.5, 32, 32]} position={[1, 0, 0]}>
        <meshStandardMaterial
          color="#6bb6ff"
          metalness={0.3}
          roughness={0.4}
          emissive="#6bb6ff"
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* 神经突触连接 */}
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={i}
          ref={(el) => {
            if (el) synapseRefs.current[i] = el;
          }}
          args={[0.1, 0.1, Math.random() * 4 + 2]}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <meshStandardMaterial
            color="#ffff66"
            emissive="#ffff66"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Box>
      ))}

      {/* 脑干 */}
      <Box args={[0.8, 3, 0.8]} position={[0, -3, 0]}>
        <meshStandardMaterial
          color="#ff9966"
          metalness={0.4}
          roughness={0.3}
          emissive="#ff9966"
          emissiveIntensity={0.2}
        />
      </Box>
    </group>
  );
};

// 能量场效果
const EnergyField: React.FC = () => {
  const fieldRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      fieldRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      
      const material = fieldRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <Sphere ref={fieldRef} args={[8, 32, 32]}>
      <meshStandardMaterial
        color="#66ffcc"
        transparent
        opacity={0.1}
        emissive="#66ffcc"
        emissiveIntensity={0.3}
        wireframe
      />
    </Sphere>
  );
};

interface Brain3DProps {
  size?: number;
  showTitle?: boolean;
}

export const Brain3D: React.FC<Brain3DProps> = ({ size = 400, showTitle = true }) => {
  return (
    <div className="relative">
      {showTitle && (
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            🧠 AI大脑运算中心
          </h3>
          <p className="text-muted-foreground mt-2">量子思维正在高速运转...</p>
        </div>
      )}
      
      <div 
        style={{ width: size, height: size }} 
        className="mx-auto rounded-2xl bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm border shadow-2xl overflow-hidden"
      >
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* 环境光 */}
          <ambientLight intensity={0.3} />
          
          {/* 主光源 */}
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#ffffff"
          />
          
          {/* 辅助光源 */}
          <pointLight 
            position={[-10, -10, -5]} 
            intensity={0.5} 
            color="#ff6b9d"
          />
          <pointLight 
            position={[10, -10, -5]} 
            intensity={0.5} 
            color="#6bb6ff"
          />
          
          {/* 聚光灯效果 */}
          <spotLight
            position={[0, 20, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            color="#66ffcc"
          />

          {/* 大脑核心 */}
          <BrainCore />
          
          {/* 量子粒子 */}
          <QuantumParticles />
          
          {/* 能量场 */}
          <EnergyField />

          {/* 状态文字 */}
          <Text
            position={[0, -6, 0]}
            fontSize={0.8}
            color="#66ffcc"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            QUANTUM PROCESSING
          </Text>
        </Canvas>
      </div>
      
      {/* 状态指示器 */}
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">神经活动</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <span className="text-sm text-muted-foreground">量子计算</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <span className="text-sm text-muted-foreground">数据流动</span>
        </div>
      </div>
    </div>
  );
};

export default Brain3D;