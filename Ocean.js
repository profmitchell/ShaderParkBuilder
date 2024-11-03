import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export class Ocean {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.objects = new Set();
    this.params = {
      waterColor: 0x001e0f,
      distortionScale: 3.7
    };
    
    this.init();
  }

  init() {
    // Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('/textures/waternormals.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: this.params.waterColor,
      distortionScale: this.params.distortionScale,
      fog: false
    });
    water.rotation.x = -Math.PI / 2;
    this.water = water;
    this.objects.add(water);

    // Sky
    const sky = new Sky();
    sky.scale.setScalar(10000);
    this.sky = sky;
    this.objects.add(sky);

    // Sun position
    const sun = new THREE.Vector3();
    const parameters = {
      elevation: 2,
      azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    
    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);
      sun.setFromSphericalCoords(1, phi, theta);
      
      sky.material.uniforms['sunPosition'].value.copy(sun);
      water.material.uniforms['sunDirection'].value.copy(sun).normalize();
      
      const sceneEnv = new THREE.Scene();
      sceneEnv.add(sky);
      const renderTarget = pmremGenerator.fromScene(sceneEnv);
      this.scene.environment = renderTarget.texture;
    }

    updateSun.call(this);

    // Add a subtle directional light for shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.objects.add(dirLight);

    // Add everything to scene
    this.objects.forEach(obj => this.scene.add(obj));
  }

  update(time) {
    if (this.water) {
      this.water.material.uniforms['time'].value += 1.0 / 60.0;
    }
  }

  dispose() {
    this.objects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    });
  }

  updateParams(newParams) {
    Object.assign(this.params, newParams);
    if (this.water) {
      this.water.material.uniforms.waterColor.value.setHex(this.params.waterColor);
      this.water.material.uniforms.distortionScale.value = this.params.distortionScale;
    }
  }
} 