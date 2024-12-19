import * as THREE from 'three';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a); // Darker, more professional background
  
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  // Accent lights for drama
  const blueLight = new THREE.PointLight(0x0044ff, 3, 10);
  blueLight.position.set(-5, 3, 5);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0xff00ff, 3, 10);
  purpleLight.position.set(5, 3, 5);
  scene.add(purpleLight);

  return scene;
};

export const createWalls = (scene: THREE.Scene) => {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide
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

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 8),
    new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    })
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -4;
  floor.receiveShadow = true;
  scene.add(floor);
};