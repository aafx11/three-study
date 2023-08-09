import * as THREE from 'three';
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as dat from 'dat.gui';

// 导入hdr环境贴图
const hdr = require('../assets/grassland.hdr');
const scene = new THREE.Scene();
// 加载hdr环境图
// const rgbeLoader = new RGBELoader();
// rgbeLoader.loadAsync(hdr).then((texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping; // 映射模式，类似圆柱
//   scene.background = texture; // 场景的背景
//   scene.environment = texture;  // 场景的环境贴图，能作用于物体的反光
// });

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

// 创建球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  // color:'black'
});
const sphere = new THREE.Mesh(sphereGeometry, material);
// 开启球体的阴影投射
sphere.castShadow = true;
scene.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 屏幕接收阴影
plane.receiveShadow = true;
scene.add(plane);

// 环境光(颜色，强度),环境光会均匀的照亮场景中的所有物体,环境光不能用来投射阴影，因为它没有方向
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
// 平行光是沿着特定方向发射的光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
// 光照投射阴影
directionalLight.castShadow = true;

// 阴影贴图的模糊度
directionalLight.shadow.radius = 10;
// 阴影贴图的分辨率
directionalLight.shadow.mapSize.set(2048, 2048);
// 设置平行光投影相机属性（光线照射的范围）
directionalLight.shadow.camera.near = 0.5; // 近端
directionalLight.shadow.camera.far = 500; // 远端
directionalLight.shadow.camera.top = 5; // 
directionalLight.shadow.camera.bottom = -5; // 
directionalLight.shadow.camera.left = -5; // 
directionalLight.shadow.camera.right = 5; // 
scene.add(directionalLight);

const gui = new dat.GUI();
gui.add(directionalLight.shadow.camera, 'near')
  .min(0)
  .max(100)
  .step(0.1)
  .onChange(() => {
    console.log('修改');
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 轨道控制器，镜头转向
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实感
controls.enableDamping = true;

// 坐标辅助器(轴线长度)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render (time) {
  // 更新控制器。必须在摄像机的变换发生任何手动改变后调用
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
  // 更新摄像头,摄像机视锥体长宽比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用
  camera.updateProjectionMatrix();

  // 更新渲染器,将输出canvas的大小调整为(width, height)并考虑设备像素比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 更新渲染器像素比,设置设备像素比。通常用于避免HiDPI设备上绘图模糊
  renderer.setPixelRatio(window.devicePixelRatio);
});