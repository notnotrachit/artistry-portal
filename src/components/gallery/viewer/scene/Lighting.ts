import * as THREE from 'three';

export const createLighting = (scene: THREE.Scene) => {
  // Base ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Main overhead light
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(0, 10, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Back fill light
  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  // Side accent lights
  const leftLight = new THREE.PointLight(0xffeedd, 1, 50);
  leftLight.position.set(-15, 5, 0);
  scene.add(leftLight);

  const rightLight = new THREE.PointLight(0xffeedd, 1, 50);
  rightLight.position.set(15, 5, 0);
  scene.add(rightLight);

  // Corner fill lights
  const backLeftLight = new THREE.PointLight(0xffeedd, 0.8, 40);
  backLeftLight.position.set(-15, 5, -7);
  scene.add(backLeftLight);

  const backRightLight = new THREE.PointLight(0xffeedd, 0.8, 40);
  backRightLight.position.set(15, 5, -7);
  scene.add(backRightLight);
};