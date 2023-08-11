import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
const gray = require('../assets/black.jpg')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)

// 创建球几何体
const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, material)
// scene.add(sphere)

// 点材质
const pointsMaterial = new THREE.PointsMaterial()
pointsMaterial.size = 10 // 点大小
// pointsMaterial.color.set(0xfff000)
pointsMaterial.sizeAttenuation = false // 指定点的大小是否因相机深度而衰减（仅限透视摄像头）

const TextureLoader = new THREE.TextureLoader()
const texture = TextureLoader.load(gray)
pointsMaterial.map = texture // 设置点材质的纹理
pointsMaterial.alphaMap = texture // 设置点材质的纹理
pointsMaterial.transparent = true
pointsMaterial.depthWrite = false
pointsMaterial.blending = THREE.AdditiveBlending

const points = new THREE.Points(sphereGeometry, pointsMaterial)
scene.add(points)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock()

function render() {
  let time = clock.getElapsedTime()

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});