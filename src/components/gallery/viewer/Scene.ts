import * as THREE from 'three';
import { createLighting } from './scene/Lighting';
import { createWalls } from './scene/Walls';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  
  createLighting(scene);

  return scene;
};

export { createWalls };