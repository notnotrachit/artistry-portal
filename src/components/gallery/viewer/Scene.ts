import * as THREE from 'three';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  
  // Enhanced ambient light for better base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Main directional light from above
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(0, 10, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Additional directional light from back to eliminate dark spots
  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  // Accent lights for atmosphere
  const leftLight = new THREE.PointLight(0xffeedd, 1, 50);
  leftLight.position.set(-15, 5, 0);
  scene.add(leftLight);

  const rightLight = new THREE.PointLight(0xffeedd, 1, 50);
  rightLight.position.set(15, 5, 0);
  scene.add(rightLight);

  // Soft light from the back corners
  const backLeftLight = new THREE.PointLight(0xffeedd, 0.8, 40);
  backLeftLight.position.set(-15, 5, -7);
  scene.add(backLeftLight);

  const backRightLight = new THREE.PointLight(0xffeedd, 0.8, 40);
  backRightLight.position.set(15, 5, -7);
  scene.add(backRightLight);

  return scene;
};

export const createWalls = (scene: THREE.Scene) => {
  // Create a sophisticated material with better light response
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

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

  // Floor with a slightly darker, matte material
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    roughness: 0.8,
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

  // Ceiling with slightly different material for depth
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.9,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 16),
    ceilingMaterial
  );
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.position.y = 8;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Front wall sections with entrance
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