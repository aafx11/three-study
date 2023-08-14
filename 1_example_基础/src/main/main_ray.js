import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75, // 摄像机视锥体垂直视野角度
  window.innerWidth / window.innerHeight, // 摄像机视锥体长宽比
  0.1, // 摄像机视锥体近端面
  500 //  摄像机视锥体远端面
)

camera.position.set(0, 0, 10)
scene.add(camera)

const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)

// 创建球几何体(radius : 球体半径, widthSegments : 水平分段数, heightSegments :垂直分段数)
// const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)
// const material = new THREE.MeshBasicMaterial({
//   color: '#135373',
//   wireframe: true
// })
// const sphere = new THREE.Mesh(sphereGeometry, material)
// scene.add(sphere)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})
const redMaterial = new THREE.MeshBasicMaterial({
  color: '#135373'
})

// 1000立方体
let cubeArr = []
for (let i = -5; i < 5; i++) {
  for (let j = -5; j < 5; j++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(i, j, z)
      scene.add(cube)
      cubeArr.push(cube)
    }
  }
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster()

// 鼠标位置对象
const mouse = new THREE.Vector2()

// 监听鼠标位置
window.addEventListener('mousemove', (event) => {
  console.log('event', event);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
  raycaster.setFromCamera(mouse, camera)
  let result = raycaster.intersectObjects(cubeArr)
  console.log(result);
  if (result.length > 0) {
    console.log("交叉点坐标", result[0].point);
    console.log("交叉对象", result[0].object);
    console.log("射线原点和交叉点距离", result[0].distance);
    result.forEach(item => {
      item.object.material = redMaterial
    })
  }
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  controls.update();
  cameraHelper.update()
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