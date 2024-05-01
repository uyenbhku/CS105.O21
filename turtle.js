import * as THREE from 'three'
import * as YUKA from './lib/yuka.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x98F5F9 );
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight(0xffffff, 10)
light.position.set(1, 1, 1.0)
scene.add(light)

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

let fish;
let mixer;
const turtle = new THREE.Group()
const loader = new GLTFLoader()
loader.load('models/sea_turtle/scene.gltf', function (gltf) {
        fish = gltf.scene
        fish.scale.set(0.5, 0.5, 0.5)
        mixer = new THREE.AnimationMixer(fish);
        gltf.animations.forEach((animation) => {
            mixer.clipAction(animation).play();
        });
        turtle.add(fish)
    }
)
turtle.matrixAutoUpdate = false
scene.add(turtle)

const entityManager = new YUKA.EntityManager()
const time = new YUKA.Time()
const dive = new YUKA.Vehicle()

dive.setRenderComponent(turtle, sync)

const wanderBehavior = new YUKA.WanderBehavior(0.5, 0.5, 0.5)
dive.steering.add(wanderBehavior)
entityManager.add(dive)



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix)
}

const stats = new Stats()
document.body.appendChild(stats.dom)


function animate() {
    requestAnimationFrame(animate)
    const delta = time.update().getDelta()
    if (mixer) {
        mixer.update(0.02);
    }
    entityManager.update(delta)
    controls.update()
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()