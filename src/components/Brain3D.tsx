import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Brain3DErrorBoundary } from './Brain3DErrorBoundary';

// 量子光束发射器
const QuantumBeams: React.FC = () => {
  const beamCount = 50;
  const beamRefs = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  const beams = useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => ({
      direction: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: Math.random() * 0.03 + 0.02,
      phase: Math.random() * Math.PI * 2,
      length: Math.random() * 15 + 10,
      color: Math.random()
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    beamRefs.current.forEach((beam, i) => {
      if (beam) {
        const time = clock.getElapsedTime();
        const beamData = beams[i];
        
        // 光束从大脑中心发射
        const progress = (Math.sin(time * beamData.speed + beamData.phase) + 1) * 0.5;
        const distance = progress * beamData.length;
        
        beam.position.copy(beamData.direction.clone().multiplyScalar(distance));
        beam.lookAt(beamData.direction.clone().multiplyScalar(distance + 1));
        
        // 光束强度变化
        const material = beam.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.5 + Math.sin(time * 3 + beamData.phase) * 0.5;
        
        // 光束透明度
        material.opacity = Math.max(0.1, 1 - progress);
      }
    });

    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {beams.map((beam, i) => (
        <Box
          key={i}
          ref={(el) => {
            if (el) beamRefs.current[i] = el;
          }}
          args={[0.05, 0.05, beam.length]}
          position={[0, 0, beam.length / 2]}
        >
          <meshStandardMaterial
            color={new THREE.Color().setHSL(beam.color, 1, 0.7)}
            emissive={new THREE.Color().setHSL(beam.color, 1, 0.7)}
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </Box>
      ))}
    </group>
  );
};

// 量子光粒子组件
const QuantumParticles: React.FC = () => {
  const particleCount = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // 生成从大脑发射的粒子
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      startPosition: new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 5
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      ),
      speed: Math.random() * 0.05 + 0.02,
      phase: Math.random() * Math.PI * 2,
      color: Math.random(),
      life: Math.random()
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      const time = clock.getElapsedTime();
      
      // 粒子生命周期 - 从大脑中心发射到外围
      particle.life = (particle.life + particle.speed) % 1;
      
      // 计算粒子位置 - 从中心向外扩散
      const progress = particle.life;
      const expansion = progress * 25;
      
      tempObject.position.copy(
        particle.startPosition.clone()
          .add(particle.velocity.clone().multiplyScalar(expansion))
          .add(new THREE.Vector3(
            Math.sin(time * 2 + particle.phase) * 2 * progress,
            Math.cos(time * 1.5 + particle.phase) * 2 * progress,
            Math.sin(time * 1.8 + particle.phase) * 2 * progress
          ))
      );
      
      // 粒子大小 - 随距离变化
      const scale = (0.15 - progress * 0.1) + Math.sin(time * 4 + particle.phase) * 0.05;
      tempObject.scale.setScalar(Math.max(0.01, scale));
      
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // 动态颜色和透明度
      const hue = (particle.color + time * 0.1) % 1;
      const alpha = Math.max(0.1, 1 - progress);
      tempColor.setHSL(hue, 1, 0.8 + Math.sin(time * 3 + particle.phase) * 0.2);
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
        emissive={new THREE.Color(0x00ffff)}
        emissiveIntensity={1.2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};

// 大脑主体结构 - 增强立体感
const BrainCore: React.FC = () => {
  const brainRef = useRef<THREE.Group>(null);
  const leftHemisphereRef = useRef<THREE.Mesh>(null);
  const rightHemisphereRef = useRef<THREE.Mesh>(null);
  const synapseRefs = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
      brainRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;
      brainRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
    }

    // 左右半球脉动效果
    if (leftHemisphereRef.current && rightHemisphereRef.current) {
      const pulsation = 1 + Math.sin(time * 2) * 0.05;
      leftHemisphereRef.current.scale.setScalar(pulsation);
      rightHemisphereRef.current.scale.setScalar(pulsation);
      
      // 发光强度变化
      const leftMaterial = leftHemisphereRef.current.material as THREE.MeshStandardMaterial;
      const rightMaterial = rightHemisphereRef.current.material as THREE.MeshStandardMaterial;
      
      leftMaterial.emissiveIntensity = 0.3 + Math.sin(time * 1.5) * 0.2;
      rightMaterial.emissiveIntensity = 0.3 + Math.sin(time * 1.5 + Math.PI) * 0.2;
    }

    // 核心能量球脉动
    if (coreRef.current) {
      const corePulse = 1 + Math.sin(time * 4) * 0.2;
      coreRef.current.scale.setScalar(corePulse);
      
      const coreMaterial = coreRef.current.material as THREE.MeshStandardMaterial;
      coreMaterial.emissiveIntensity = 1 + Math.sin(time * 6) * 0.5;
    }

    // 神经突触电流效果
    synapseRefs.current.forEach((synapse, i) => {
      if (synapse && synapse.material) {
        const material = synapse.material as THREE.MeshStandardMaterial;
        const intensity = 0.8 + Math.sin(time * 5 + i * 0.5) * 0.7;
        material.emissiveIntensity = Math.max(0.2, intensity);
        
        // 突触颜色变化
        const hue = (time * 0.1 + i * 0.1) % 1;
        material.emissive.setHSL(hue, 1, 0.6);
      }
    });
  });

  return (
    <group ref={brainRef}>
      {/* 核心能量球 */}
      <Sphere ref={coreRef} args={[0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* 大脑主体 - 左半球（更立体的材质）*/}
      <Sphere ref={leftHemisphereRef} args={[2.8, 64, 64]} position={[-1.2, 0, 0]}>
        <meshStandardMaterial
          color="#ff4080"
          metalness={0.1}
          roughness={0.2}
          emissive="#ff4080"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>
      
      {/* 大脑主体 - 右半球（更立体的材质）*/}
      <Sphere ref={rightHemisphereRef} args={[2.8, 64, 64]} position={[1.2, 0, 0]}>
        <meshStandardMaterial
          color="#4080ff"
          metalness={0.1}
          roughness={0.2}
          emissive="#4080ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* 大脑表面纹理 - 左半球褶皱 */}
      {Array.from({ length: 15 }, (_, i) => (
        <Box
          key={`left-${i}`}
          args={[0.2, 0.1, Math.random() * 3 + 1]}
          position={[
            -1.2 + (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <meshStandardMaterial
            color="#ff6090"
            emissive="#ff6090"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </Box>
      ))}

      {/* 大脑表面纹理 - 右半球褶皱 */}
      {Array.from({ length: 15 }, (_, i) => (
        <Box
          key={`right-${i}`}
          args={[0.2, 0.1, Math.random() * 3 + 1]}
          position={[
            1.2 + (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <meshStandardMaterial
            color="#6090ff"
            emissive="#6090ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </Box>
      ))}

      {/* 神经突触连接 - 增强效果 */}
      {Array.from({ length: 30 }, (_, i) => (
        <Box
          key={`synapse-${i}`}
          ref={(el) => {
            if (el) synapseRefs.current[i] = el;
          }}
          args={[0.08, 0.08, Math.random() * 6 + 3]}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </Box>
      ))}

      {/* 脑干 - 增强立体感 */}
      <Box args={[1, 4, 1]} position={[0, -4, 0]}>
        <meshStandardMaterial
          color="#ff8040"
          metalness={0.3}
          roughness={0.2}
          emissive="#ff8040"
          emissiveIntensity={0.4}
        />
      </Box>

      {/* 连接桥 */}
      <Box args={[2.5, 0.3, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
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

// 加载组件
const LoadingBrain: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-6xl mb-4 animate-pulse">🧠</div>
    <p className="text-muted-foreground">正在启动量子思维...</p>
  </div>
);

export const Brain3D: React.FC<Brain3DProps> = ({ size = 400, showTitle = true }) => {
  return (
    <Brain3DErrorBoundary>
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
          <Suspense fallback={<LoadingBrain />}>
            <Canvas
              camera={{ position: [0, 0, 15], fov: 60 }}
              style={{ width: '100%', height: '100%' }}
              gl={{ antialias: true, alpha: true }}
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
              
              {/* 量子光束 */}
              <QuantumBeams />
              
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
              >
                QUANTUM PROCESSING
              </Text>
            </Canvas>
          </Suspense>
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
    </Brain3DErrorBoundary>
  );
};

export default Brain3D;