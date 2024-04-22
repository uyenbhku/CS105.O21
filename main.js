import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from 'three/addons/objects/Water.js';
import * as THREE from 'three';

let scene, camera, renderer, controls, gui;

function init() {
    // Initialize a scene
    scene = new THREE.Scene();
    // Initialize a GUI
    gui = new dat.GUI();   
    // Initialize and config a camera
    camera = setupCamera();  
    // Initialize and config a renderer
    renderer = setupRenderer();
    
    // Orbit Controls
    controls = setupControls();

    // ROOM
    var room = createRoom();
    scene.add(room)

    // Light fixture geometry
    const fixtureGeometry = new THREE.BoxGeometry(6, 2, 6); // Adjust size as needed
    const fixtureMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // White color for fixture
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    fixture.position.set(-140, 60, 0); // Position the fixture on the left wall
    room.add(fixture);
    // AMBIENT LIGHT 
    var ambientLight = createAmbientLight(2, 'rgb(255, 255, 255)');
    ambientLight.position.copy(fixture.position); // Position the light at the same position as the fixture
    room.add(ambientLight);


    // FISH TANK
    const fishTank = createFishTank();
    fishTank.position.y -= 123 - 19;
    fishTank.position.z += 50;
    
    // !!! CODE HERE
    // Add Objects to the scene
    // Con cá trong bể bơi thì thêm vào fishTank
    // const fishName = createFishName(); 
    // fishTank.add(fishName);

    function createBlueWhale(){
        const BlueWhale = new THREE.Group(); // Tạo một nhóm mới để chứa mesh và tất cả các thành phần khác của cá voi xanh
    
        let mixer;
        let mesh; // Định nghĩa biến mesh ở phạm vi toàn cục
    
        // Load model
        const loader = new GLTFLoader().setPath('public/blue_whale/');
    
        loader.load('scene.gltf', (gltf) => {
            console.log('Đang tải model');
            mesh = gltf.scene;
    
            // Tính toán kích thước của mô hình
            const box = new THREE.Box3().setFromObject(mesh);
            const size = new THREE.Vector3();
            box.getSize(size);
    
            // Tính toán kích thước của fishTank
            const boxtank = new THREE.Box3().setFromObject(fishTank);
            const sizetank = new THREE.Vector3();
            boxtank.getSize(sizetank);
    
            // Tính toán tỷ lệ scale giữa kích thước của mô hình và kích thước của fishTank
            const scaleRatio = (Math.min(sizetank.x / size.x, sizetank.y / size.y, sizetank.z / size.z))*0.6;
    
            // Điều chỉnh kích thước của mô hình
            mesh.scale.set(scaleRatio, scaleRatio, scaleRatio);
            //mesh.rotation.x = Math.PI / 2;
            
            mixer = new THREE.AnimationMixer(mesh);
            // Associate animations with the mixer and play them
            gltf.animations.forEach((animation) => {
                mixer.clipAction(animation).play();
            });

            // Thêm mesh vào nhóm BlueWhale
            BlueWhale.add(mesh);

            function animate() {
                requestAnimationFrame(animate);
                // // Update the animation mixer
                if (mixer) {
                   mixer.update(0.1);
                 }
            }
            // Bắt đầu vòng lặp animate
            animate();
        });
    
        return BlueWhale;
    }    

    // đồ ngoại cảnh thì thêm vào scene
    const BlueWhale = createBlueWhale(); 

    BlueWhale.position.y = 123 - 100;
    BlueWhale.position.y = 123 - 100;
    BlueWhale.position.z -= 100;

    fishTank.add(BlueWhale);
    // END CODE
    scene.add(fishTank)

    // TABLE
    const table = createTable();
    table.position.y -= 150 - 25;
    table.position.z += 110;
    table.position.x -= 30;
    scene.add(table);
    
    // LIGHTING
    var directionalLight = createDirectionalLight(1);
    directionalLight.intensity = 5;
    scene.add(directionalLight);
    // Create a helper to visualize the directional light's view and frustum
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
    scene.add(directionalLightHelper);
    // LAMP
    const myLamp = createLamp();
    myLamp.position.y += 2;    
    myLamp.position.z += 10;    
    myLamp.position.x -= 17;    
    table.add(myLamp);
    
    
    // SETUP GUI 
    var lightsFolder = gui.addFolder('Lights');
    // Directional Light Controls
    setupDirectionalLightControls(directionalLight, lightsFolder);
    
    // Ambient Light Controls
    setupAmbientLightControls(ambientLight, lightsFolder);
    
    // Spot Light Controls
    // var spotLight = createSpotLight(2, 0xffffff);
    
    // spotLight.position.set(0, 100, 0);
    // setupSpotLightControls(spotLight, lightsFolder);
    // var spotLightHelper = new THREE.SpotLightHelper( spotLight, 2.5 );
    // scene.add(spotLightHelper);
    // scene.add(spotLight);

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

function setupDirectionalLightControls(directionalLight, parentFolder=None) {

    if (!parentFolder) {
        parentFolder = gui;
    }
    
    var directionalLightFolder = parentFolder.addFolder('Directional Light');
    let directionalLightVisible = true; // Initial state of ambient light visibility
    directionalLightFolder.add(
        {"visible": directionalLightVisible}, 
        "visible"
    ).onChange((value) => {
        directionalLightVisible = value;
        directionalLight.visible = directionalLightVisible; // Toggle ambient light visibility
    });

    var posDirectionalLightControls = directionalLightFolder.addFolder('Position');
    var rotDirectionalLightControls = directionalLightFolder.addFolder('Rotation');
    directionalLightFolder.add(directionalLight, 'intensity', 0, 10).name('Intensity');
    directionalLightFolder.addColor(directionalLight, 'color').name('Color');
    posDirectionalLightControls.add(directionalLight.position, 'x', -50, 50);
    posDirectionalLightControls.add(directionalLight.position, 'y', -50, 100);
    posDirectionalLightControls.add(directionalLight.position, 'z', -50, 50);
    rotDirectionalLightControls.add(directionalLight.rotation, 'x', -1, 1);
    rotDirectionalLightControls.add(directionalLight.rotation, 'y', -1, 1);
    rotDirectionalLightControls.add(directionalLight.rotation, 'z', -1, 1);
}

function setupAmbientLightControls(ambientLight, parentFolder=None) {

    if (!parentFolder) {
        parentFolder = gui;
    }
    var ambientLightControls = parentFolder.addFolder('Ambient Light');
    ambientLightControls.add(ambientLight, 'intensity', 0, 2).name('Intensity');

    // turn on and off
    let ambientLightVisible = true; // Initial state of ambient light visibility
    ambientLightControls.add(
        {"visible": ambientLightVisible}, 
        "visible"
    ).onChange((value) => {
        ambientLightVisible = value;
        ambientLight.visible = ambientLightVisible; // Toggle ambient light visibility
    });
}

function setupSpotLightControls(spotLight,  parentFolder=None) {

    if (!parentFolder) {
        parentFolder = gui;
    }

    // Spot Light Controls
    var spotLightFolder = parentFolder.addFolder('Spot Light');
    let spotLightVisible = true; // Initial state of ambient light visibility
    spotLightFolder.add(
        {"visible": spotLightVisible}, 
        "visible"
    ).onChange((value) => {
        spotLightVisible = value;
        spotLight.visible = spotLightVisible; // Toggle ambient light visibility
    });

    var posSpotLightControls = spotLightFolder.addFolder('Position');
    var rotSpotLightControls = spotLightFolder.addFolder('Rotation');
    spotLightFolder.add(spotLight, 'intensity', 0, 10).name('Intensity');
    spotLightFolder.addColor(spotLight, 'color').name('Color');
    // spotLightFolder.add(spotLight, 'penumbra', 0, 1);
    posSpotLightControls.add(spotLight.position, 'x', -22, 22);
    posSpotLightControls.add(spotLight.position, 'y', -50, 100);
    posSpotLightControls.add(spotLight.position, 'z', -13, 13);
    rotSpotLightControls.add(spotLight.rotation, 'x', -1, 1);
    rotSpotLightControls.add(spotLight.rotation, 'y', -1, 1);
    rotSpotLightControls.add(spotLight.rotation, 'z', -1, 1);
}

// returns a room 
function createRoom() {
    const room = new THREE.Group();

    // Wall material
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 'rgb(199, 199, 255)',
    });

    // Floor
    const floorGeometry = new THREE.BoxGeometry(300, 2, 300);
    const floor = new THREE.Mesh(floorGeometry, wallMaterial);
    floor.position.y = -150;
    floor.receiveShadow = true;
    floor.castShadow = true;
    room.add(floor);

    // Left Wall
    const leftWallGeometry = new THREE.BoxGeometry(2, 300, 300);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -150;
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    room.add(leftWall);

    // Back Wall
    const backWallGeometry = new THREE.BoxGeometry(300, 300, 2);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -150;
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    room.add(backWall);

    return room;
}

function createFishTank() {
    const fishTank = new THREE.Group();

    // Assuming you have variables defining the fish tank size
    const tankWidth = 170; // Example width of the fish tank
    const tankHeight = 200; // Example height of the fish tank
    const tankDepth = 200; // Example depth of the fish tank
    
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
    const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 300, 300);
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

function createCorals(numberOfCorals=25) {
    const corals = new THREE.Group();
    const scale = 0.005;

    // Helper function to change coral color
    function changeCoralColor(coralModel, color) {
        coralModel.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }

    const loader = new GLTFLoader().setPath('./public/');
    const coralModels = [
        '/corals/Coral0.glb',
        '/corals/Coral1.glb',
        '/corals/Coral2.glb',
        '/corals/Coral3.glb',
        '/corals/Coral4.glb',
        '/corals/Coral5.glb',
        '/corals/Coral6.glb'
    ];

    // fixed corals
    loader.load('/corals/Coral0.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = 0.38;
        coralModel.position.y = -0.45;
        coralModel.position.z = -0.4;
        changeCoralColor(coralModel, 0xff0000);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral1.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = -0.38;
        coralModel.position.y = -0.5;
        coralModel.position.z = -0.35;
        changeCoralColor(coralModel, 0xffff00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral2.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.position.z = -0.2;
        changeCoralColor(coralModel, 0xff5b00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral3.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = 0.32;
        coralModel.position.y = -0.4;
        coralModel.position.z = 0.4;
        changeCoralColor(coralModel, 0xffff00);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral4.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.3;
        changeCoralColor(coralModel, 0x051094);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral5.glb', function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);

        coralModel.position.x = -0.4;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.4;
        changeCoralColor(coralModel, 0xff1ff4);
        corals.add(coralModel);
    });    

    loader.load('/corals/Coral6.glb', function (gltf) {
        const coralModel = gltf.scene;
        const rScale = THREE.MathUtils.randFloat(-(scale+0.002), scale+0.001);
        coralModel.scale.set(rScale, rScale, rScale);
        coralModel.position.x = 0.32;
        coralModel.position.y = -0.5;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.25;
        changeCoralColor(coralModel, 0xff5b00);
        corals.add(coralModel);
    });    

    // random corals at random places
    for (let i = 0; i < numberOfCorals; i++) {
        // Randomly select a coral model
        const randomCoralIndex = Math.floor(Math.random() * coralModels.length);
        const coralPath = coralModels[randomCoralIndex];

        loader.load(coralPath, function (gltf) {
            const coralModel = gltf.scene;
            coralModel.scale.set(scale, scale, scale);

            // Generate random position within a range
            const posX = THREE.MathUtils.randFloat(-0.36, 0.36); // Adjust range as needed
            const posY = -0.4;
            const posZ = THREE.MathUtils.randFloat(-.39, .39); // Adjust range as needed
            coralModel.position.set(posX, posY, posZ);
            coralModel.rotation.y = THREE.MathUtils.randFloat(-1, 1);

            // Change coral color if needed
            const randomColor = Math.random() * 0xffffff;
            changeCoralColor(coralModel, randomColor);

            corals.add(coralModel);

            // Check if all corals have been loaded
            if (corals.children.length === numberOfCorals) {
                // All corals are loaded
                console.log('All corals loaded:', corals);
            }
        });
    }

    return corals;
}

function createTable() {
    const table = new THREE.Group();

    // Table top
    const tableTopGeometry = new THREE.BoxGeometry(50, 2, 30);
    const tableTopMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.castShadow = true; // Enable shadow casting
    tableTop.receiveShadow = true; // Enable shadow receiving
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
    leg1.castShadow = true; 
    leg1.receiveShadow = true;
    table.add(leg1);

    // Leg 2
    const leg2Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg2Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg2 = new THREE.Mesh(leg2Geometry, leg2Material);
    leg2.castShadow = true; 
    leg2.receiveShadow = true;
    leg2.position.set(20, -12, -13);
    table.add(leg2);

    // Leg 3
    const leg3Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg3Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg3 = new THREE.Mesh(leg3Geometry, leg3Material);
    leg3.castShadow = true; 
    leg3.receiveShadow = true;
    leg3.position.set(-20, -12, 13);
    table.add(leg3);

    // Leg 4
    const leg4Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg4Material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown color
    const leg4 = new THREE.Mesh(leg4Geometry, leg4Material);
    leg4.castShadow = true; 
    leg4.receiveShadow = true;
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

    // Configure shadow parameters
    light.shadow.mapSize.width = 1024; // Set shadow map width (higher resolution)
    light.shadow.mapSize.height = 1024; // Set shadow map height (higher resolution)
    light.shadow.camera.near = 1; // Near plane of the shadow camera
    light.shadow.camera.far = 50; // Far plane of the shadow camera
    light.shadow.camera.left = -10; // Left frustum edge
    light.shadow.camera.right = 10; // Right frustum edge
    light.shadow.camera.top = 20; // Top frustum edge
    light.shadow.camera.bottom = -20; // Bottom frustum edge
    light.shadow.bias = -0.001; // Bias to avoid shadow acne
    light.shadow.camera.visible = true; // Show the shadow camera helper

    return light;
}

function createAmbientLight(intensity, color=0xffffff) {
    var light = new THREE.AmbientLight(
        color, 
        intensity
    );
    return light;
}

function createSpotLight(intensity, color=0xffffff, angle = Math.PI / 6) {
    var light = new THREE.SpotLight(
        color, 
        intensity
    );
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.camera.visible = true; // Show the shadow camera helper
    // Set the light angle (spread)
    light.angle = angle;

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
    camera.position.set(500, 20, 400);  
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