import * as THREE from 'three';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  // Accent lights for atmosphere
  const blueLight = new THREE.PointLight(0x0044ff, 2, 15);
  blueLight.position.set(-5, 3, 5);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0xff00ff, 2, 15);
  purpleLight.position.set(5, 3, 5);
  scene.add(purpleLight);

  return scene;
};

export const createWalls = (scene: THREE.Scene) => {
  // Create a more sophisticated material with subtle texture
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.8,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });

  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 8),
    wallMaterial
  );
  backWall.position.z = -4;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Side walls
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -7.5;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 7.5;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Floor with a more sophisticated material
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    roughness: 0.9,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 8),
    floorMaterial
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -4;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 8),
    wallMaterial
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 4;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Front wall with entrance
  const frontWallLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 8),
    wallMaterial
  );
  frontWallLeft.position.z = 4;
  frontWallLeft.position.x = -5;
  frontWallLeft.receiveShadow = true;
  scene.add(frontWallLeft);

  const frontWallRight = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 8),
    wallMaterial
  );
  frontWallRight.position.z = 4;
  frontWallRight.position.x = 5;
  frontWallRight.receiveShadow = true;
  scene.add(frontWallRight);

  const frontWallTop = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 2),
    wallMaterial
  );
  frontWallTop.position.z = 4;
  frontWallTop.position.y = 3;
  frontWallTop.receiveShadow = true;
  scene.add(frontWallTop);

  return {
    bounds: {
      minX: -7,
      maxX: 7,
      minZ: -3.5,
      maxZ: 3.5,
      minY: -3.5,
      maxY: 3.5
    }
  };
};