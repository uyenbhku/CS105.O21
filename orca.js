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
    75, window.innerWidth / window.innerHeight,
    0.1, 1000
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
const Orca = new THREE.Group()
const loader = new GLTFLoader()
loader.load('models/female_orca/scene.gltf', function (gltf) {
        fish = gltf.scene
        fish.scale.set(0.1, 0.1, 0.1)
        mixer = new THREE.AnimationMixer(fish);
        gltf.animations.forEach((animation) => {
            mixer.clipAction(animation).play();
        });
        Orca.add(fish)
    }
)

Orca.matrixAutoUpdate = false
scene.add(Orca)

const entityManager = new YUKA.EntityManager()
const time = new YUKA.Time()
const swim = new YUKA.Vehicle()

swim.setRenderComponent(Orca, sync)

const path = new YUKA.Path()
path.loop = true
path.add(new YUKA.Vector3(-4, 2, 4))
path.add(new YUKA.Vector3(-6, -2, 0))
path.add(new YUKA.Vector3(-4, 2, -4))
path.add(new YUKA.Vector3(0, 0, 0))
path.add(new YUKA.Vector3(4, -2, -4))
path.add(new YUKA.Vector3(6, 2, 0))
path.add(new YUKA.Vector3(4, 0, 4))
path.add(new YUKA.Vector3(0, 0, 6))

swim.position.copy(path.current())

const followPathBehavior = new YUKA.FollowPathBehavior(path, 1)
swim.steering.add(followPathBehavior)
const onPathBehavior = new YUKA.OnPathBehavior(path, 0.5)
swim.steering.add(onPathBehavior)
entityManager.add(swim)



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
        mixer.update(0.05);
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