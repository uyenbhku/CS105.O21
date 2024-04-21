import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x98F5F9 );
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight(0xffffff, 100)
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

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/whale.fbx',
    (object) => {
        object.name='orca'
        object.scale.multiplyScalar(0.001)
        scene.add(object)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)
    var fbxObject = scene.getObjectByName('orca')
    if (fbxObject) {
       fbxObject.rotation.x += 0.01
       fbxObject.rotateX += 0.01
    }
    controls.update()
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()