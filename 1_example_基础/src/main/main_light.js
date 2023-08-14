import * as THREE from 'three';
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
  RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader';
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
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 屏幕接收阴影
plane.receiveShadow = true;
scene.add(plane);

// // 环境光(颜色，强度),环境光会均匀的照亮场景中的所有物体,环境光不能用来投射阴影，因为它没有方向
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
// 平行光是沿着特定方向发射的光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.target = sphere
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

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

const gui = new dat.GUI();
gui.add(directionalLight.shadow.camera, 'near')
  .min(0)
  .max(100)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix();
  });
gui.add(directionalLight.shadow.camera, 'far').min(0).max(100).step(0.1).onChange(() => {
  directionalLight.shadow.camera.updateProjectionMatrix();
});

// 直射光源
// const spotLight = new THREE.SpotLight(0xffffff, 1)
// spotLight.position.set(5, 5, 5)
// spotLight.castShadow = true
// spotLight.intensity = 2 // 光照强度
// // 阴影贴图的模糊度
// spotLight.shadow.radius = 20
// // 阴影贴图的分辨率
// spotLight.shadow.mapSize.set(4096, 4096)
// spotLight.target = sphere // 聚光灯的方向是从它的位置到目标位置
// spotLight.angle = Math.PI / 6 // 灯光角度，从聚光灯的位置以弧度表示聚光灯的最大范围
// spotLight.distance = 0 // 从光源发出光的最大距离，其强度根据光源的距离线性衰减
// spotLight.penumbra = 0 // 聚光锥的半影衰减百分比。在0和1之间的值,值越低越清晰
// spotLight.decay = 0 // 沿着光照距离的衰减量

// scene.add(spotLight)
// scene.add(spotLight.target)

// gui.add(sphere.position, 'x').min(-5).max(5).step(0.1)
// gui.add(spotLight, 'angle')
//   .min(0)
//   .max(Math.PI / 2)
//   .step(0.01)
// gui.add(spotLight, 'distance').min(0).max(10).step(0.01)
// gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01)
// gui.add(spotLight, 'decay').min(0).max(5).step(0.01)

// 点光源
const pointLight = new THREE.PointLight(0xff0000, 1)
pointLight.position.set(2, 2, 2)
pointLight.castShadow = true
pointLight.shadow.radius = 20
pointLight.shadow.mapSize.set(512, 512)

// scene.add(pointLight)

// ( light : PointLight, sphereSize : 球形辅助对象的尺寸. 默认为 1, color : Hex )
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
// scene.add(pointLightHelper)

// gui.add(pointLight.position, 'x').min(-5).max(5).step(0.1)
// gui.add(pointLight, 'distance').min(0).max(10).step(0.01)
// gui.add(pointLight, 'decay').min(0).max(5).step(0.01)

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({
    color: 0xff0000
  })
)
smallBall.position.set(2, 2, 2)
smallBall.add(pointLight)
scene.add(smallBall)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
// 是否使用物理上正确的光照模式
renderer.physicallyCorrectLights = true

document.body.appendChild(renderer.domElement);

// 轨道控制器，镜头转向
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实感
controls.enableDamping = true;

// 坐标辅助器(轴线长度)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock()

function render() {
  let time = clock.getElapsedTime()
  smallBall.position.x = Math.sin(time) * 3
  smallBall.position.z = Math.cos(time) * 3
  smallBall.position.y = 2 + Math.sin(time * 10) / 2
  // 更新控制器。必须在摄像机的变换发生任何手动改变后调用
  controls.update();
  directionalLightHelper.update()
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