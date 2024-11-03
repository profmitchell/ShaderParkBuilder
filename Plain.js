import * as THREE from 'three';

export class Plain {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.init();
  }

  init() {
    // Simple gradient background
    this.scene.background = new THREE.Color(0x111111);
  }

  update(time) {
    // No animation needed for plain background
  }

  dispose() {
    // Nothing to dispose
  }
} 