import * as THREE from 'three';

export class Studio {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.objects = new Set();
    this.params = {
      fogNear: 10,
      fogFar: 500,
      groundColor: 0xcbcbcb,
      backgroundColor: 0xa0a0a0,
      lightIntensity: 3
    };
    
    this.init();
  }

  init() {
    // Scene background and fog
    this.scene.background = new THREE.Color(this.params.backgroundColor);
    this.scene.fog = new THREE.Fog(this.params.backgroundColor, this.params.fogNear, this.params.fogFar);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, this.params.lightIntensity);
    hemiLight.position.set(0, 100, 0);
    this.objects.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, this.params.lightIntensity);
    dirLight.position.set(0, 40, 50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.set(1024, 1024);
    this.objects.add(dirLight);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshPhysicalMaterial({ 
        color: this.params.groundColor,
        metalness: 0.1,
        roughness: 0.7,
        envMapIntensity: 1.0
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    this.objects.add(ground);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(100, 100, 0x555555, 0x333333);
    gridHelper.position.y = -1.99;
    this.objects.add(gridHelper);

    // Add everything to scene
    this.objects.forEach(obj => this.scene.add(obj));
  }

  updateParams(newParams) {
    Object.assign(this.params, newParams);
    this.scene.background.setHex(this.params.backgroundColor);
    this.scene.fog.near = this.params.fogNear;
    this.scene.fog.far = this.params.fogFar;
    // Update other parameters as needed
  }

  update(time) {
    // No animation needed for studio environment
  }

  dispose() {
    this.objects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    });
  }
} 