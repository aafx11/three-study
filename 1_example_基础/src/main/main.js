import * as THREE from 'three';
// 导入轨道控制器
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import gsap from 'gsap';
import * as dat from 'dat.gui';

// 导入纹理
let img = require('../assets/chunge_flower.png');
let bg = require('../assets/1111111.jpg');
let ao = require('../assets/0617ffpicrtyrrtgf02744.jpg');
// 导入置换贴图
let height = require('../assets/height.png');
// 导入hdr环境贴图
const hdr = require('../assets/grassland.hdr');
const scene = new THREE.Scene();
// 加载hdr环境图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync(hdr).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; // 映射模式，类似圆柱
  scene.background = texture; // 场景的背景
  scene.environment = texture;  // 场景的环境贴图，能作用于物体的反光
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);
let event = {};
event.onLoad = () => {
  console.log('纹理加载完成');
};
event.onProgress = (url, num, total) => {
  console.log('图片加载进度', `${url}:${num}/${total}`);
};
// 加载管理器
const LoadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress
);

// 导入纹理
const textureLoader = new THREE.TextureLoader(LoadingManager);
const texture = textureLoader.load(img, event.onLoad, event.onProgress);
const alphaMap = textureLoader.load(bg);
const aoMap = textureLoader.load(ao);

// 导入置换贴图
const heightTexture = textureLoader.load(height);

// 纹理偏移
// texture.offset.x = 0.5
// texture.offset.y = 0.5
texture.offset.set(0.5, 0.5);
// 设置旋转的原点,默认是在左下角0,0
texture.center.set(0.5, 0.5);
// 纹理旋转
texture.rotation = Math.PI / 4;
// 设置纹理重复
texture.repeat.set(2, 3);
// 设置纹理的重复模式
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.MirroredRepeatWrapping;
// 当一个纹素覆盖小于一个像素时，贴图将如何采样
texture.minFilter = THREE.NearestFilter;
// 当一个纹素覆盖大于一个像素时，贴图将如何采样
texture.magFilter = THREE.NearestFilter;
// texture.minFilter = THREE.LinearFilter
// texture.magFilter = THREE.LinearFilter

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 材质
const cubeMaterial = new THREE.MeshBasicMaterial({
  // color: 0xffff00,
  map: texture, // 颜色贴图
  alphaMap: alphaMap, // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
  transparent: true,
  opacity: 1,
  side: THREE.BackSide, // 定义将要渲染哪一面
  aoMap: aoMap, // 该纹理的红色通道用作环境遮挡贴图
  aoMapIntensity: 0.5, // 环境遮挡效果的强度
});

const material = new THREE.MeshStandardMaterial({
  map: texture, // 颜色贴图
  // alphaMap: alphaMap, // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
  transparent: true,
  opacity: 1,
  // side: THREE.BackSide, // 定义将要渲染哪一面
  // aoMap: aoMap, // 该纹理的红色通道用作环境遮挡贴图
  // aoMapIntensity: 0.5, // 环境遮挡效果的强度
  displacementMap: heightTexture,
  displacementScale: 0.05,
  roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射
  // roughnessMap: // 该纹理的绿色通道用于改变材质的粗糙度
  metalness: 0.5, // 材质与金属的相似度,金属使用1.0
  // metalnessMap: // 该纹理的蓝色通道用于改变材质的金属度
  // normalMap: // 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。
  // envMap: // 环境贴图，类似镜片反射环境
});

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const plane = new THREE.Mesh(
  planeGeometry,
  material
);
plane.position.set(3, 0, 0);
scene.add(plane);

// 给屏幕设置第二组uv
planeGeometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 添加用户界面改变变量
// const gui = new dat.GUI()
// gui.add(cube.position, 'x')
//   .min(0)
//   .max(5)
//   .step(0.01) // 浮点位数
//   .name('移动x轴')
//   .onChange((value) => {
//     console.log('value', value);
//   })
//   .onFinishChange((value) => {
//     console.log('完全停止', value);
//   })

// // 修改物体颜色
// const params = {
//   color: '#ffff00',
//   fn: () => {
//     gsap.to(cube.position, {
//       x: 5,
//       duration: 5,
//       yoyo: true,
//       repeat: -1
//     })
//   }
// }
// gui.addColor(params, 'color')
//   .onChange((value) => {
//     console.log('修改', value);
//     cube.material.color.set(value)
//   })

// // 控制物体隐藏和展示
// gui.add(cube, 'visible').name('是否展示')
// // 设置按钮事件
// gui.add(params, 'fn').name('立方体移动')

// // 设置一个可收缩的选项
// let folder = gui.addFolder('设置立方体')
// 是否将几何体渲染成线框
// folder.add(cube.material, 'wireframe') 

// 环境光(颜色，强度),环境光会均匀的照亮场景中的所有物体,环境光不能用来投射阴影，因为它没有方向
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
// 平行光是沿着特定方向发射的光
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// directionalLight.position.set(10, 10, 10)
// scene.add(directionalLight)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)

// 轨道控制器，镜头转向
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实感
controls.enableDamping = true;

// 坐标辅助器(轴线长度)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

// 设置动画
// let animate1 = gsap.to(cube.position, {
//   x: 5,
//   duration: 5,
//   ease: 'power.inOut',
//   repeat: 2,
//   yoyo: true, // 往返运动
//   delay: 2, // 延迟
//   onStart: () => {
//     console.log('动画开始');
//   },
//   onComplete: () => {
//     console.log('动画完成');
//   }
// })
// gsap.to(cube.rotation, {
//   x: 2 * Math.PI,
//   duration: 5
// })

// 双击暂停和开始
// window.addEventListener('dblclick', () => {
//   if (animate1.isActive()) {
//     animate1.pause()
//   } else {
//     animate1.resume()
//   }
// })

// 双击全屏
window.addEventListener('dblclick', () => {
  const fullScreenElement = document.fullscreenElement;
  console.log('fullScreenElement', fullScreenElement);
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

function render (time) {

  // 物体移动
  // cube.position.x += 0.01
  // if (cube.position.x >= 5) {
  //   cube.position.x = 0
  // }

  // 物体缩放
  // cube.scale.set(3, 2, 1)
  // cube.scale.x += 0.01

  // 旋转
  // cube.rotation.set(Math.PI / 4, 0, 0, 'XYZ')
  // cube.rotation.x += 0.01

  // time：requestAnimationFrame的执行时长
  // console.log('time', time); 
  // let t = (time / 1000) % 5
  // cube.position.x = t * 1
  // if (cube.position.x >= 5) {
  //   cube.position.x = 0
  // }
  // 获取时钟运行的总时长
  // let clockTime = clock.getElapsedTime()
  // let deltaTime = clock.getDelta()
  // // console.log('时钟运行总时长',clockTime);
  // // console.log('两次获取时间的间隔时间',deltaTime);
  // let t = clockTime % 5
  // cube.position.x = t * 1

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