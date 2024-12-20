import * as THREE from 'three';
import { createWallMaterial, createFloorMaterial, createCeilingMaterial } from './Materials';

export const createWalls = (scene: THREE.Scene) => {
  const wallMaterial = createWallMaterial();
  
  // Back wall - increased depth significantly
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 20),
    wallMaterial
  );
  backWall.position.z = -30; // Moved further back
  backWall.receiveShadow = true;
  // Add this line to make sure both sides of the wall are visible
  backWall.material.side = THREE.DoubleSide;
  scene.add(backWall);

  // Side walls - increased depth significantly
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 20), // Increased depth
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -20;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 20), // Increased depth
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 20;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Floor - increased size
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 60), // Increased depth
    createFloorMaterial()
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -10;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling - increased size
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 60), // Increased depth
    createCeilingMaterial()
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 10;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Removed the front wall sections that were creating the door-like appearance

  return {
    bounds: {
      minX: -19,
      maxX: 19,
      minZ: -29, // Increased depth bounds
      maxZ: 29,  // Increased depth bounds
      minY: -9,
      maxY: 9
    }
  };
};