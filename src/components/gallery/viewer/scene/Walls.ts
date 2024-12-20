import * as THREE from 'three';
import { createWallMaterial, createFloorMaterial, createCeilingMaterial } from './Materials';

export const createWalls = (scene: THREE.Scene) => {
  const wallMaterial = createWallMaterial();
  
  // Back wall - increased width and height
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 20),
    wallMaterial
  );
  backWall.position.z = -15;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Side walls - increased depth and height
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 20),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -20;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 20),
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 20;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Floor - increased size
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 30),
    createFloorMaterial()
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -10;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling - increased size
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 30),
    createCeilingMaterial()
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 10;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Front wall sections - increased size
  const frontWallLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 20),
    wallMaterial
  );
  frontWallLeft.position.z = 15;
  frontWallLeft.position.x = -12.5;
  frontWallLeft.receiveShadow = true;
  scene.add(frontWallLeft);

  const frontWallRight = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 20),
    wallMaterial
  );
  frontWallRight.position.z = 15;
  frontWallRight.position.x = 12.5;
  frontWallRight.receiveShadow = true;
  scene.add(frontWallRight);

  const frontWallTop = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5),
    wallMaterial
  );
  frontWallTop.position.z = 15;
  frontWallTop.position.y = 7.5;
  frontWallTop.receiveShadow = true;
  scene.add(frontWallTop);

  return {
    bounds: {
      minX: -19,
      maxX: 19,
      minZ: -14,
      maxZ: 14,
      minY: -9,
      maxY: 9
    }
  };
};