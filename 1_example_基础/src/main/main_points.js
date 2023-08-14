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
pointsMaterial.map = texture // 使用来自Texture的数据设置点的颜色
pointsMaterial.alphaMap = texture // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
pointsMaterial.transparent = true // 定义此材质是否透明,通过设置材质的opacity属性来控制材质透明的程度
pointsMaterial.depthWrite = false // 渲染此材质是否对深度缓冲区有任何影响
pointsMaterial.blending = THREE.AdditiveBlending // 在使用此材质显示对象时要使用何种混合

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