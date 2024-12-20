import * as THREE from 'three';

export const createLighting = (scene: THREE.Scene) => {
  // Enhanced ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Main overhead lights
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(0, 15, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Colorful accent lights
  const colors = {
    purple: 0x8B5CF6,
    blue: 0x0EA5E9,
    orange: 0xF97316,
    pink: 0xD946EF
  };

  // Back wall accent lights
  const backLeftLight = new THREE.PointLight(colors.purple, 200, 6000);
  backLeftLight.position.set(-15, 10, -12);
  scene.add(backLeftLight);

  const backRightLight = new THREE.PointLight(colors.blue, 200, 60);
  backRightLight.position.set(15, 5, -12);
  scene.add(backRightLight);

  // Side wall accent lights
  const leftWallLight = new THREE.PointLight(colors.orange,200, 60);
  leftWallLight.position.set(-18, 5, 0);
  scene.add(leftWallLight);

  const rightWallLight = new THREE.PointLight(colors.pink, 200, 60);
  rightWallLight.position.set(18, 5, 0);
  scene.add(rightWallLight);

  // Corner fill lights with proper typing
  const cornerLights: Array<{ position: [number, number, number], color: number }> = [
    { position: [-18, 8, -12], color: 0xFDE1D3 },
    { position: [18, 8, -12], color: 0xD3E4FD },
    { position: [-18, 8, 12], color: 0xE5DEFF },
    { position: [18, 8, 12], color: 0xFEC6A1 }
  ];

  cornerLights.forEach(({ position, color }) => {
    const light = new THREE.PointLight(color, 5, 50);
    light.position.set(position[0], position[1], position[2]);
    scene.add(light);
  });

  // Floor lights with proper typing
  const ceilingLights: Array<{ position: [number, number, number], color: number }> = [
    { position: [-10, 8, -8], color: 0xF2FCE2 },
    { position: [10, 8, -8], color: 0xFEF7CD },
    { position: [-10, 8, 8], color: 0xFFDEE2 },
    { position: [10, 8, 8], color: 0xFDE1D3 }
  ];

  ceilingLights.forEach(({ position, color }) => {
    const light = new THREE.PointLight(color, 5, 40);
    light.position.set(position[0], position[1], position[2]);
    scene.add(light);
  });
};