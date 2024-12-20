import * as THREE from 'three';

export const createWallMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
};

export const createFloorMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xe8e8e8,
    roughness: 0.3,
    metalness: 0.2,
    side: THREE.DoubleSide
  });
};

export const createCeilingMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
};