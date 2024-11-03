import * as THREE from 'three';
import { Sky as ThreeSky } from 'three/examples/jsm/objects/Sky.js';

export class Sky {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.objects = new Set();
    this.params = {
      turbidity: 10,
      rayleigh: 3
    };
    this.init();
  }

  init() {
    const sky = new ThreeSky();
    sky.scale.setScalar(450000);
    this.sky = sky;
    this.objects.add(sky);

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = this.params.turbidity;
    uniforms['rayleigh'].value = this.params.rayleigh;
    uniforms['mieCoefficient'].value = 0.005;
    uniforms['mieDirectionalG'].value = 0.7;

    const sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - 2);
    const theta = THREE.MathUtils.degToRad(180);
    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);

    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x555555,
      metalness: 0.1,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    this.objects.add(ground);

    // Add directional light for shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.objects.add(dirLight);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.objects.add(ambientLight);

    this.objects.forEach(obj => this.scene.add(obj));
  }

  updateParams(newParams) {
    Object.assign(this.params, newParams);
    if (this.sky) {
      this.sky.material.uniforms['turbidity'].value = this.params.turbidity;
      this.sky.material.uniforms['rayleigh'].value = this.params.rayleigh;
    }
  }

  update(time) {
    // Optional: Animate sky here if desired
  }

  dispose() {
    this.objects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    });
  }
} 