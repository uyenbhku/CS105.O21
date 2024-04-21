import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from 'three/addons/objects/Water.js';
import * as THREE from 'three';

let scene, camera, renderer, controls;

function init() {
    // Initialize a scene
    scene = new THREE.Scene();
    // Initialize a GUI
    var gui = new dat.GUI();   
    // Initialize and config a camera
    camera = setupCamera();  
    // Initialize and config a renderer
    renderer = setupRenderer();
    
    // Orbit Controls
    controls = setupControls();

    // ROOM
    var room = createRoom();
    scene.add(room)

    // AMBIENT LIGHT 
    var ambientLight = createAmbientLight(2, 'rgb(255, 255, 255)');
    ambientLight.position.x = 13;
    ambientLight.position.y = 10;
    ambientLight.position.z = 3;
    ambientLight.intensity = 0.9;
    scene.add(ambientLight);
    
    // FISH TANK
    const fishTank = createFishTank();
    fishTank.position.y -= 100 - 19;
    fishTank.position.z += 50;
    
    // !!! CODE HERE
    // Add Objects to the scene
    // Con cá trong bể bơi thì thêm vào fishTank
    // const fishName = createFishName():
    // fishTank.add(fishName);
    
    // đồ ngoại cảnh thì thêm vào scene

    // END CODE
    scene.add(fishTank)

    // TABLE
    const table = createTable();
    table.position.y -= 100 - 25;
    table.position.z += 70;
    table.position.x -= 30;
    scene.add(table);
    
    // LIGHTING
    var directionalLight = createDirectionalLight(1);
    directionalLight.position.x = -18;
    directionalLight.position.y = -3.2;
    directionalLight.position.z = 10;
    directionalLight.intensity = 5;
    scene.add(directionalLight);
    
    // LAMP
    const myLamp = createLamp();
    myLamp.position.y -= 100 - 29.5;    
    myLamp.position.z += 70;
    myLamp.position.x -= 30;
    directionalLight.add(myLamp);


    // SETUP GUI 
    var lightsFolder = gui.addFolder('Lights');

    // Directional Light Controls
    var directionalLightControls = lightsFolder.addFolder('Directional Light');
    directionalLightControls.add(directionalLight, 'intensity', 0, 10).name('Intensity');
    directionalLightControls.addColor(directionalLight, 'color').name('Color');
    directionalLightControls.add(directionalLight.position, 'x', -22, 22);
    directionalLightControls.add(directionalLight.position, 'z', -13, 13);

    // Ambient Light Controls
    var ambientLightControls = lightsFolder.addFolder('Ambient Light');
    ambientLightControls.add(ambientLight, 'intensity', 0, 2).name('Intensity');
    ambientLightControls.add(ambientLight.position, 'x', 0, 50);
    ambientLightControls.add(ambientLight.position, 'y', 0, 50);
    ambientLightControls.add(ambientLight.position, 'z', 0, 50);
    
    // END SETUP GUI

    // render 
    document.body.appendChild(renderer.domElement);
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

// returns a room 
function createRoom() {
    const room = new THREE.Group();

    // Wall material
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 'rgb(199, 199, 187)',
    });

    // Floor
    const floorGeometry = new THREE.BoxGeometry(200, 2, 200);
    const floor = new THREE.Mesh(floorGeometry, wallMaterial);
    floor.position.y = -100;
    room.add(floor);

    // Left Wall
    const leftWallGeometry = new THREE.BoxGeometry(2, 200, 200);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -100;
    room.add(leftWall);

    // Back Wall
    const backWallGeometry = new THREE.BoxGeometry(200, 200, 2);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -100;
    room.add(backWall);

    return room;
}

function createFishTank() {
    const fishTank = new THREE.Group();

    // Assuming you have variables defining the fish tank size
    const tankWidth = 90; // Example width of the fish tank
    const tankHeight = 100; // Example height of the fish tank
    const tankDepth = 150; // Example depth of the fish tank
    
    // Load fish tank model
    const loader = new GLTFLoader().setPath('./public/');
    loader.load('/cage/glass_cage.glb', function (gltf) {
        const fishTankModel = gltf.scene;
        fishTankModel.name = 'fish-tank';
        fishTankModel.scale.set(
            tankWidth, // Example scale factor for width
            tankHeight, // Example scale factor for height
            tankDepth  // Example scale factor for depth
        );
        fishTankModel.position.set(5, 10, 10);

        fishTankModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        const glass = fishTankModel.getObjectByName("Cube_2");
        glass.name = 'tank-glass';
        glass.material.transparent = true;
        glass.material.opacity = 0.1;

        const waterSurface = createWaterSurface();
        const water = createWater();
        const corals = createCorals();

        water.add(corals);
        
        glass.add(water);
        glass.add(waterSurface);

        const count = waterSurface.geometry.attributes.position.count;
        const damping = 0.35;

        function animate() {
            const now_slow = Date.now() / 400;
            for (let i = 0; i < count; i++) {
                const x = waterSurface.geometry.attributes.position.getX(i);
                const y = waterSurface.geometry.attributes.position.getY(i);
                const xangle = x + now_slow;
                const xsin = Math.sin(xangle) * damping;
                const yangle = y + now_slow;
                const ycos = Math.cos(yangle) * damping;
                waterSurface.geometry.attributes.position.setZ(i, xsin + ycos);
            }
            waterSurface.geometry.computeVertexNormals();
            waterSurface.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animate);
        }

        animate();
        fishTank.add(fishTankModel);
    });

    fishTank.castShadow = true;
    fishTank.receiveShadow = true;
    return fishTank;
}

function createWaterSurface() {
    const WIDTH = 30;
    const HEIGHT = 30;
    const waterColor = 0x0189F9;
    const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 200, 200);
    const waterSurfaceMaterial = new THREE.MeshPhongMaterial({
        color: waterColor, // Use the same color as the water
    });
    const waterSurface = new Water(geometry, waterSurfaceMaterial);
    waterSurface.name = 'water_surface';
    waterSurface.receiveShadow = true;
    waterSurface.castShadow = true;
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.scale.set(0.06, 0.06, 0.06);
    waterSurface.position.y += 0.84;

    return waterSurface;
}

function createWater() {
    const waterColor = 0x0189F9; // Blue color for water

    // Create a box geometry or any other geometry representing water
    const waterGeometry = new THREE.BoxGeometry(1, 1.2, 1); // Adjust size as needed

    // Create a material for the water (transparent and blue color)
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: waterColor,
        transparent: true,
        opacity: 0.5, // Adjust opacity as needed
    });

    // Create the water mesh using the geometry and material
    const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
    waterMesh.name = 'water';

    // Adjust position and scale of the water mesh
    waterMesh.scale.set(1.8, 1.8, 1.8);
    waterMesh.position.y -= 0.25;

    return waterMesh;
}

function createCorals() {
    const corals = new THREE.Group();

     // Helper function to change coral color
     function changeCoralColor(coralModel, color) {
        coralModel.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }

    const loader = new GLTFLoader().setPath('./public/');
    loader.load('/corals/Coral0.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = 0.35;
        coralModel.position.y = -0.45;
        coralModel.position.z = -0.4;
        changeCoralColor(coralModel, 0xff0000);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral1.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = 0.25;
        coralModel.position.y = -0.5;
        coralModel.position.z = 0.1;
        changeCoralColor(coralModel, 0xffff00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral2.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.position.z = -0.2;
        changeCoralColor(coralModel, 0xff5b00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral3.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.4;
        coralModel.position.z = 0.1;
        changeCoralColor(coralModel, 0xffff00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral4.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.3;
        changeCoralColor(coralModel, 0x051094);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral5.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);

        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = -0.3;
        changeCoralColor(coralModel, 0xff1ff4);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral6.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(0.01, 0.01, 0.01);
        coralModel.position.x = 0.32;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.25;
        changeCoralColor(coralModel, 0xff5b00);
        corals.add(coralModel);
    });    

    return corals;
}

function createTable() {
    const table = new THREE.Group();

    // Table top
    const tableTopGeometry = new THREE.BoxGeometry(50, 2, 30);
    const tableTopMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    table.add(tableTop);

    // Leg parameters
    const legWidth = 2;
    const legHeight = 25;
    const legDepth = 2;

    // Leg 1
    const leg1Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg1Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg1 = new THREE.Mesh(leg1Geometry, leg1Material);
    leg1.position.set(-20, -12, -13);
    table.add(leg1);

    // Leg 2
    const leg2Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg2Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg2 = new THREE.Mesh(leg2Geometry, leg2Material);
    leg2.position.set(20, -12, -13);
    table.add(leg2);

    // Leg 3
    const leg3Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg3Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg3 = new THREE.Mesh(leg3Geometry, leg3Material);
    leg3.position.set(-20, -12, 13);
    table.add(leg3);

    // Leg 4
    const leg4Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg4Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg4 = new THREE.Mesh(leg4Geometry, leg4Material);
    leg4.position.set(20, -12, 13);
    table.add(leg4);

    return table;
}

function createLamp() {
    const lamp = new THREE.Group();

    // Lamp base
    const baseGeometry = new THREE.BoxGeometry(4, 1, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 }); // Gray color
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    lamp.add(base);

    // Lamp stand
    const standGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 }); // Gray color
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 10; // Position the stand above the base
    lamp.add(stand);

    // Lamp shade
    const shadeGeometry = new THREE.ConeGeometry(6, 12, 32);
    const shadeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 }); // Yellow color
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.y = 20; // Position the shade above the stand
    lamp.add(shade);

    return lamp;
}

function createDirectionalLight(intensity, color=0xffffff) {
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

function createAmbientLight(intensity, color=0xffffff) {
    var light = new THREE.AmbientLight(
        color, 
        intensity
    );
    // light.castShadow = true;
    return light;
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // set size 
    renderer.setSize(window.innerWidth, window.innerHeight);
    // set scene background 
    renderer.setClearColor('rgb(100, 100, 100)')
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(100, 20, 200);  
    return camera;
}

function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.update();
    return controls;
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

init();