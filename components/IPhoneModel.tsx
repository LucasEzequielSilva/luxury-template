"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
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

/* Imagen fija del mismo modelo, vista de atrás. Es lo que se ve cuando no hay
   WebGL o cuando three.js falla en el teléfono. */
function TelefonoFijo() {
  return (
    <div className="relative w-full h-[500px] lg:h-full">
      <Image
        src="/iphone-hero.png"
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 80vw, 40vw"
        className="object-contain"
      />
    </div>
  );
}

/* Sin esto, cualquier excepción del renderer 3D subía hasta el error boundary
   global de Next y la home entera se reemplazaba por la página blanca de
   "Application error". El iPhone 3D es decorativo: si falla, se muestra la
   imagen fija y el resto de la página sigue. */
class RedDeSeguridad3D extends Component<{ children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("iPhone 3D desactivado por un error del renderer:", error);
  }
  render() {
    return this.state.fallo ? <TelefonoFijo /> : this.props.children;
  }
}

/* Si los reflejos fallan, no se renderiza nada en su lugar: el modelo ya
   tiene cinco luces y se ve bien sin ellos. Perder el 3D entero por un
   archivo decorativo era desproporcionado. */
class ReflejosOpcionales extends Component<{ children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Reflejos del iPhone 3D desactivados:", error);
  }
  render() {
    return this.state.fallo ? null : this.props.children;
  }
}

/* Chrome en muchos Android de gama media bloquea WebGL por la GPU. Ahí
   three.js tira "Error creating WebGL context" al montar el Canvas, y eso
   era lo que tiraba abajo la home. Se prueba antes de montar. */
function hayWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function IPhoneModel() {
  /* null hasta montar: en el servidor no se puede saber y el Canvas tampoco
     renderiza nada ahí, así que no cambia lo que ve el visitante. */
  const [soporta, setSoporta] = useState<boolean | null>(null);
  useEffect(() => {
    setSoporta(hayWebGL());
  }, []);

  if (soporta === null) return <div className="w-full h-[500px] lg:h-full" />;
  if (!soporta) return <TelefonoFijo />;

  return (
    <RedDeSeguridad3D>
      <div className="w-full h-[500px] lg:h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.8} />
          {/* Rim light to separate the (often dark) phone from the black background */}
          <directionalLight position={[0, 2, -6]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-6, 0, 2]} intensity={1.2} color="#d4a843" />
          <Suspense fallback={<Loader />}>
            <Center>
              <Model />
            </Center>
          </Suspense>
          {/* Los reflejos son un HDR propio, servido desde el sitio. El preset
              "studio" de drei lo bajaba de raw.githubusercontent.com, que no es
              un CDN y devuelve 503 cada tanto; ese fallo tiraba la página
              entera. Van en su propio boundary: si el archivo no carga, el
              teléfono sigue girando iluminado por las luces, sin reflejos. */}
          <ReflejosOpcionales>
            <Suspense fallback={null}>
              <Environment files="/hdr/studio_small_03_1k.hdr" />
            </Suspense>
          </ReflejosOpcionales>
          <OrbitControls
            autoRotate
            autoRotateSpeed={5}
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>
      </div>
    </RedDeSeguridad3D>
  );
}
