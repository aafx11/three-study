import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 18);
scene.add(camera);

const cubeArr = [];

// 设置物体材质
const cubeMaterial = new CANNON.Material("cube");

function createCube () {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereMaterial = new THREE.MeshBasicMaterial();
  const cube = new THREE.Mesh(cubeGeometry, sphereMaterial);
  cube.castShadow = true; // 发出阴影
  scene.add(cube);
  // 创建物理立方体形状
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));


  // 创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape, // 形状
    position: new CANNON.Vec3(0, 0, 0),
    mass: 1, // 小球质量
    material: cubeMaterial, // 材质
  });
  // cubeBody.applyLocalForce(
  //   new CANNON.Vec3(1800, 0, 0), // 添加的力的大小和方向
  //   new CANNON.Vec3(0, 0, 0), // 施加的力所在的位置
  // )
  // 将物体添加到物理世界
  world.addBody(cubeBody);

  // 创建打击声音
  const sound = require('../assets/video/collision.mp3');
  const hitSound = new Audio(sound);

  // 添加监听碰撞事件
  function HitEvent (e) {
    console.log('hit', e);
    // 获取碰撞强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    console.log('碰撞强度', impactStrength);
    if (impactStrength > 5) {
      hitSound.currentTime = 0; // 重置播放
      hitSound.volume = impactStrength / 20 > 1 ? 1 : impactStrength / 20;
      hitSound.play();
    }
  }
  // sphereBody.addEventListener('collide', HitEvent)
  cubeBody.addEventListener('collide', HitEvent);
  cubeArr.push({
    mesh: cube,
    body: cubeBody
  });
}

window.addEventListener('click', createCube);

// 创建球，立方体和平面
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial();
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
const sphere = new THREE.Mesh(cubeGeometry, sphereMaterial);
sphere.castShadow = true; // 发出阴影
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  })
);
floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true; // 接收阴影
scene.add(floor);

// 创建物理世界
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0); // 重力
// // 创建物理小球形状
// const sphereShape = new CANNON.Sphere(1)
// // 设置物体材质
// const sphereShapeMaterial = new CANNON.Material("sphere")

// // 创建物理世界的物体
// const sphereBody = new CANNON.Body({
//   shape: sphereShape, // 形状
//   position: new CANNON.Vec3(0, 0, 0),
//   mass: 1, // 小球质量
//   material: sphereShapeMaterial, // 材质
// })
// // 将物体添加到物理世界
// world.addBody(sphereBody)

// // 创建物理立方体形状
// const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// // 设置物体材质
// const cubeMaterial = new CANNON.Material("cube")

// // 创建物理世界的物体
// const cubeBody = new CANNON.Body({
//   shape: cubeShape, // 形状
//   position: new CANNON.Vec3(0, 0, 0),
//   mass: 1, // 小球质量
//   material: cubeMaterial, // 材质
// })
// // 将物体添加到物理世界
// world.addBody(cubeBody)

// // 创建打击声音
// const sound = require('../assets/video/collision.mp3')
// const hitSound = new Audio(sound)

// // 添加监听碰撞事件
// function HitEvent(e) {
//   console.log('hit', e);
//   // 获取碰撞强度
//   const impactStrength = e.contact.getImpactVelocityAlongNormal()
//   console.log('碰撞强度', impactStrength);
//   if (impactStrength > 5) {
//     hitSound.currentTime = 0 // 重置播放
//     hitSound.play()
//   }
// }
// // sphereBody.addEventListener('collide', HitEvent)
// cubeBody.addEventListener('collide', HitEvent)

// 物理世界创建地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
const floorMaterial = new CANNON.Material("floor");
floorBody.material = floorMaterial;
// 当质量为0时，可以使物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
// 地面位置
floorBody.position.set(0, -5, 0);
// 旋转地面的位置(setFromAxisAngle设置给定轴和角度)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

// 设置2种材质碰撞的参数
// const defaultContactMaterial = new CANNON.ContactMaterial(
//   sphereMaterial,
//   floorMaterial, {
//     friction: 0.5, // 摩擦力
//     restitution: 0.7 // 弹性
//   }
// )

const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeMaterial,
  floorMaterial, {
  friction: 0.5, // 摩擦力
  restitution: 0.7 // 弹性
}
);

// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞的默认材料，如果材料没有设置，默认都用这个
world.defaultContactMaterial = defaultContactMaterial;

// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock();

function render () {
  let deltaTime = clock.getDelta();
  // 更新物理世界（固定步长，相对上次的步长）
  world.step(1 / 120, deltaTime);
  // 将非物理世界的小球位置同步为物理世界中小球的位置
  // sphere.position.copy(sphereBody.position)
  // sphere.position.copy(cubeBody.position)
  cubeArr.forEach((item) => {
    // sphere.position.copy(cubeBody.position)
    item.mesh.position.copy(item.body.position);
    // 设置渲染的物体跟随物理的物体旋转
    item.mesh.quaternion.copy(item.body.quaternion);
  });

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