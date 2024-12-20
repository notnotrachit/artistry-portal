import * as THREE from 'three';

export const createWallMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
};

export const createFloorMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
};

export const createCeilingMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.9,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
};