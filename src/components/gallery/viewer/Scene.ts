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
  const blueLight = new THREE.PointLight(0x0044ff, 2, 25);
  blueLight.position.set(-10, 3, 10);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0xff00ff, 2, 25);
  purpleLight.position.set(10, 3, 10);
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

  // Back wall - increased size
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    wallMaterial
  );
  backWall.position.z = -8;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Side walls - increased size
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

  // Floor with a more sophisticated material - increased size
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    roughness: 0.9,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    floorMaterial
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -8;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling - increased size
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    wallMaterial
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 8;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Front wall with entrance - increased size
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