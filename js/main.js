import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import { TextureLoader } from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

function Scene() {
  return new THREE.Scene();
}

function Camera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
}

function Light(scene) {
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(0, 1000, 0);
  topLight.castShadow = true;
  scene.add(topLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5, 1000);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);
}

function Controls(camera, renderer) {
  return new OrbitControls(camera, renderer.domElement);
}

// function Background(scene) {
//   const loader = new TextureLoader();
//   const texture = loader.load("images/ocean.webp");

//   const geometry = new THREE.SphereGeometry(500, 32, 32);
//   const material = new THREE.MeshBasicMaterial({ map: texture });
//   const background = new THREE.Mesh(geometry, material);

//   background.material.side = THREE.BackSide;

//   scene.add(background);
// }

// Hàm thêm cá bé bé
function ModelLoader(scene) {
  const loader = new GLTFLoader();
  loader.load(
    `models/ryukin_goldfish/scene.gltf`,
    function (gltf) {
      const object = gltf.scene;
      // console.log(object);
      scene.add(object);

      const mixer = new THREE.AnimationMixer(object);
      gltf.animations.forEach((animation) => {
        mixer.clipAction(animation).play();
      });

      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        mixer.update(delta);
      }
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );
}

function Renderer() {
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  document.getElementById("container3D").appendChild(renderer.domElement);
  return renderer;
}

const scene = Scene();
const camera = Camera();
const renderer = Renderer();
Light(scene);
Controls(camera, renderer);
ModelLoader(scene);
// Background(scene);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
