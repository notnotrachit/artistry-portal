import * as THREE from 'three';

export interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface MouseState {
  isLeftMouseDown: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

export interface CameraState {
  verticalAngle: number;
  keyStates: { [key: string]: boolean };
}