import * as THREE from 'three';
import { createWallMaterial, createFloorMaterial, createCeilingMaterial } from './Materials';

export const createWalls = (scene: THREE.Scene) => {
  const wallMaterial = createWallMaterial();
  
  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    wallMaterial
  );
  backWall.position.z = -8;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Side walls
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -15;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 15;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    createFloorMaterial()
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -8;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    createCeilingMaterial()
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 8;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Front wall sections
  const frontWallLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 16),
    wallMaterial
  );
  frontWallLeft.position.z = 8;
  frontWallLeft.position.x = -10;
  frontWallLeft.receiveShadow = true;
  scene.add(frontWallLeft);

  const frontWallRight = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 16),
    wallMaterial
  );
  frontWallRight.position.z = 8;
  frontWallRight.position.x = 10;
  frontWallRight.receiveShadow = true;
  scene.add(frontWallRight);

  const frontWallTop = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 4),
    wallMaterial
  );
  frontWallTop.position.z = 8;
  frontWallTop.position.y = 6;
  frontWallTop.receiveShadow = true;
  scene.add(frontWallTop);

  return {
    bounds: {
      minX: -14,
      maxX: 14,
      minZ: -7,
      maxZ: 7,
      minY: -7,
      maxY: 7
    }
  };
};