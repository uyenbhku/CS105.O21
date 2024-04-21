import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Khởi tạo renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Khởi tạo scene
const scene = new THREE.Scene();

// Khởi tạo camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 0);
camera.lookAt(scene.position)

// Khởi tạo controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target.set(0, 1, 0);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Màu trắng mềm
scene.add(ambientLight);

let mixer;

// Load model
const loader = new GLTFLoader().setPath('public_/blue_whale/');

loader.load('scene.gltf', (gltf) => {
    console.log('Đang tải model');
    const mesh = gltf.scene;

    // Tính toán kích thước của mô hình
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Tính toán kích thước của camera
    const frustumSize = 35; // Thay đổi giá trị này tùy thuộc vào phạm vi của camera
    const aspect = window.innerWidth / window.innerHeight;
    const cameraSize = Math.max(size.x, size.y, size.z);
    const distance = cameraSize / (2 * Math.tan(camera.fov * Math.PI / 360));

    // Tính toán tỷ lệ giữa kích thước của camera và kích thước của mô hình
    const scale = (frustumSize / distance)*0.5;

    // Điều chỉnh kích thước của mô hình
    mesh.scale.set(scale, scale, scale);
    scene.add(mesh);

    mixer = new THREE.AnimationMixer(mesh);
    // Associate animations with the mixer and play them
    gltf.animations.forEach((animation) => {
        mixer.clipAction(animation).play();
    });
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  // Update the animation mixer
  if (mixer) {
    mixer.update(0.01);
  }
  controls.update();
  renderer.render(scene, camera);

}
animate();
