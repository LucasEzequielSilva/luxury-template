"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/iphone.glb");
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Calculate bounding box to auto-fit the model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model
    scene.position.sub(center);

    // Fit camera to model size
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.35;

    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

export default function IPhoneModel() {
  return (
    <div className="w-full h-[500px] lg:h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Suspense fallback={<Loader />}>
          <Center>
            <Model />
          </Center>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={5}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
