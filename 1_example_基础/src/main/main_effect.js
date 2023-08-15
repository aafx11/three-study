import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import {
  GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
// 导入后期效果合成器
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer';

// three框架自带的效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

// 模型加载
const gltfLoader = new GLTFLoader();
gltfLoader.load('./model/cardboard_box_01_1k.gltf/cardboard_box_01_1k.gltf', (gltf) => {
  console.log('gltf', gltf);
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      child.frustumCulled = false;
      //模型阴影
      child.castShadow = true;
      //模型自发光
      child.material.emissive = child.material.color;
      child.material.emissiveMap = child.material.map;
    }
  });
  const mesh = gltf.scene;
  scene.add(mesh);
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

// 合成效果
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);
// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 点效果
const dotScreenPass = new DotScreenPass();
// effectComposer.addPass(dotScreenPass)

// 抗锯齿
const smaaPass = new SMAAPass();
// effectComposer.addPass(smaaPass);

// 发光效果
const unrealBloomPass = new UnrealBloomPass();
effectComposer.addPass(unrealBloomPass);

// unrealBloomPass.exposure = 1;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
unrealBloomPass.strength = 1;
unrealBloomPass.radius = 0;
unrealBloomPass.threshold = 1;

const gui = new dat.GUI();
gui.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01);
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.01);
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.01);
gui.add(unrealBloomPass, 'threshold').min(0).max(2).step(0.01);

// 闪烁
const glitchPass = new GlitchPass();
// effectComposer.addPass(glitchPass);


renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render () {
  controls.update();
  // renderer.render(scene, camera);
  effectComposer.render();
  requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});