import * as THREE from 'three';

let scene, camera, renderer, object;

function init() {
    // Initialize a scene
    scene = new THREE.Scene();

    // Initialize a camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);
    
    // Initialize a renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Render the scene
    render();

    window.addEventListener('resize', onWindowResize);
}


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true;
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}


init()