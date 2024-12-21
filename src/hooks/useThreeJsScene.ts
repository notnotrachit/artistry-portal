import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createScene, createWalls } from '../components/gallery/viewer/Scene';

export const useThreeJsScene = (containerRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = createScene();
    const { bounds } = createWalls(scene);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    return () => {
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    bounds: sceneRef.current ? createWalls(sceneRef.current).bounds : undefined
  };
};