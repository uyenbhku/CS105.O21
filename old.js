import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

function init() {
    // Initialize a scene
    var scene = new THREE.Scene();
    var gui = new dat.GUI();   
    const loader = new GLTFLoader().setPath('./public/');

    loader.load( '/glass_cage.glb', function ( gltf ) {
        // gltf.position.y = 20;
        const fish_tank = gltf.scene;
        fish_tank.name = 'fish-tank'
        fish_tank.scale.set(20, 20, 20);
        fish_tank.position.set(5, 30, 10);
        console.log(fish_tank)
        const fish_tank_glass = fish_tank.getObjectByName("Cube_2");
        const fish_tank_box = fish_tank.getObjectByName("Cube_1");
        // fish_tank_box.color = 
        fish_tank_glass.name = 'tank_glass';
        fish_tank_glass.material.transparent = true;
        fish_tank_glass.material.opacity = 0.1; 
        console.log(fish_tank_glass)

        // TEXTURES
        const textureLoader = new THREE.TextureLoader();

        const waterBaseColor = textureLoader.load("./textures/water/Water_002_COLOR.jpg");
        const waterNormalMap = textureLoader.load("./textures/water/Water_002_NORM.jpg");
        const waterHeightMap = textureLoader.load("./textures/water/Water_002_DISP.png");
        const waterRoughness = textureLoader.load("./textures/water/Water_002_ROUGH.jpg");
        const waterAmbientOcclusion = textureLoader.load("./textures/water/Water_002_OCC.jpg");

        // PLANE
        const WIDTH = 30;
        const HEIGHT = 30;
        const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 200, 200);
        const water_surface = new Water(geometry, 
            { 
                map: 0x0189F9, 
                normalMap: waterNormalMap, 
                displacementMap: waterHeightMap, displacementScale: 0.01, 
                roughnessMap: waterRoughness, roughness: 0, 
                aoMap: waterAmbientOcclusion 
            }
        );
        water_surface.name = 'water_surface';
        water_surface.receiveShadow = true;
        water_surface.castShadow = true;
        water_surface.rotation.x = - Math.PI / 2;
        water_surface.scale.set(0.06, 0.06, 0.06);
        water_surface.position.y += 0.84;
        // water_surface.material.transparent = true;
        // water_surface.material.opacity = 0.; 
        
        fish_tank_glass.add(water_surface);

        const count = geometry.attributes.position.count;
        const damping = 0.25;
        // ANIMATE
        function animate() {

            // SINE WAVE
            const now_slow = Date.now() / 400;
            for (let i = 0; i < count; i++) {
                const x = geometry.attributes.position.getX(i)
                const y = geometry.attributes.position.getY(i)

                const xangle = x + now_slow
                const xsin = Math.sin(xangle) * damping
                const yangle = y + now_slow
                const ycos = Math.cos(yangle) * damping

                geometry.attributes.position.setZ(i, xsin + ycos)
            }
            geometry.computeVertexNormals();
            geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        document.body.appendChild(renderer.domElement);
        animate();


        const water = new Water(new THREE.BoxGeometry(1, 1.2, 1), { 
                color: 0x0189F9
            });
        water.name = 'water';
        water.scale.set(1.8, 1.8, 1.8);
        water.position.y -= 0.25;
        water.material.transparent = true;
        water.material.opacity = 0.5;
        fish_tank_glass.add(water);
        console.log(water)

        scene.add( fish_tank );
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    var directionalLight = getDirectionalLight(1);
    directionalLight.position.x = 6;
    directionalLight.position.y = 22;
    directionalLight.position.z = 23;
    directionalLight.intensity = 2.9;
    
    var ambientLight = getAmbientLight(2, 'rgb(255, 255, 255)');
    ambientLight.position.x = 13;
    ambientLight.position.y = 10;
    ambientLight.position.z = 3;
    ambientLight.intensity = 3;

    var spotLight = getSpotLight(10, 'rgb(0, 255, 255)');
    spotLight.position.y = 40;
    var light = getLight(2);
    
    var spotLightFolder = gui.addFolder('Spot Light Controls');
    spotLightFolder.add(spotLight, 'intensity', 0, 10);
    spotLightFolder.add(spotLight.position, 'x', 0, 50);
    spotLightFolder.add(spotLight.position, 'y', 0, 50);
    spotLightFolder.add(spotLight.position, 'z', 0, 50);
    spotLightFolder.add(spotLight, 'penumbra', 0, 1); // for spotLight

    var pool = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0.5,
            transmission: 1,
            color: 'rgb(25, 120, 17)',
        }),
    )
    pool.position.y = 3.5*pool.geometry.parameters.height / 2;


    var helper = new THREE.CameraHelper(directionalLight.shadow.camera)
    scene = getRoom(scene);
    scene.add(spotLight);
    scene.add(directionalLight);
    scene.add(ambientLight);
    spotLight.add(light);
    scene.add(helper);
    getWater(scene, renderer);
    // Initialize a camera
    var camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(200, 10, 0);
    // set where the camera looks at, with a 3D Vector
    camera.lookAt(pool.position);
    

    // Initialize a renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    // set size 
    renderer.setSize(window.innerWidth, window.innerHeight);
    // set scene background 
    renderer.setClearColor('rgb(500, 500, 500)')
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.body.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, -40);
    controls.update();
    // dynamic update 
    update(renderer, scene, camera, controls);

    

    // responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    
    return scene;
}





function getWater(scene, renderer) {
    
}


function getRoom(scene) {
    var wall_1 = getBox(60, 60, 0.5, 'rgb(199, 199, 187)');
    wall_1.name = 'wall front';
    wall_1.position.y = wall_1.geometry.parameters.height / 2;
    // wall_1.position.x = wall_1.geometry.parameters.width / 2;
    wall_1.position.z = wall_1.geometry.parameters.width / 2;
    
    var wall_2 = getBox(60, 60, 0.5, 'rgb(199, 199, 187)');
    wall_2.name = 'wall left';
    wall_2.rotation.x = Math.PI / 2;
 
    var wall_3 = getBox(60, 60, 0.5, 'rgb(199, 199, 187)');
    wall_3.name = 'wall right';
    wall_3.position.x = -wall_3.geometry.parameters.width / 2;
    wall_3.position.y = wall_3.geometry.parameters.height / 2;
    wall_3.rotation.y = -Math.PI / 2;

    scene.add(wall_1);
    scene.add(wall_2);
    scene.add(wall_3);
    return scene;
}


// ANIMATE
function animate_water_wave() {

    // SINE WAVE
    const now_slow = Date.now() / 400;
    for (let i = 0; i < count; i++) {
        const x = geometry.attributes.position.getX(i)
        const y = geometry.attributes.position.getY(i)

        const xangle = x + now_slow
        const xsin = Math.sin(xangle) * damping
        const yangle = y + now_slow
        const ycos = Math.cos(yangle) * damping

        geometry.attributes.position.setZ(i, xsin + ycos)
    }
    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function getBox(w, h, d, color='rgb(500, 500, 500)') {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: color,
    })
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    )

    mesh.castShadow = true;

    return mesh;
}


function getPlane(size, color='rgb(230, 230, 230)') {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: color,
        side: THREE.DoubleSide
    })
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    )

    mesh.receiveShadow = true;

    return mesh;
}


function getPointLight(intensity, color=0xffffff) {
    var light = new THREE.PointLight(
        color, 
        intensity
    );
    light.castShadow = true;
    return light;
}


function getSpotLight(intensity, color=0xffffff) {
    var light = new THREE.SpotLight(
        color, 
        intensity
    );
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 5048;
    light.shadow.mapSize.height = 5048;
    return light;
}


function getDirectionalLight(intensity, color=0xffffff) {
    var light = new THREE.DirectionalLight(
        color, 
        intensity
    );
    light.castShadow = true;

    light.shadow.camera.left = -5;
    light.shadow.camera.bottom = -5;
    light.shadow.camera.right = -5;
    light.shadow.camera.top = -5;

    return light;
}


function getAmbientLight(intensity, color=0xffffff) {
    var light = new THREE.AmbientLight(
        color, 
        intensity
    );
    // light.castShadow = true;
    return light;
}


function getLight(size, color='rgb(255, 5, 255)', resolution=50) {
    var geometry = new THREE.SphereGeometry(size, resolution, resolution);
    var material = new THREE.MeshBasicMaterial({
        color: color,
    })
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    )

    return mesh;
}


function update(renderer, scene, camera, controls) {
    // Render the scene
    renderer.render(scene, camera);

    controls.update();
    // handle the render of the scene
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    });
}


const setSize = (camera, renderer, scene) => {
    const container = renderer.domElement.parentNode;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  };


var scene = init();