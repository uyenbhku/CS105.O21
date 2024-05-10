import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";
import * as THREE from "three";
import * as YUKA from './lib/yuka.module.js';

////// WELCOME PAGE
const progressBar = document.getElementById('progress-bar');
const welcomePageContainer = document.querySelector('.welcome-page-container');
const progressBarContainer = document.querySelector('.progress-bar-container');
const labelProgressBar = progressBarContainer.querySelector('#label-progress-bar');
const hideButton = welcomePageContainer.querySelector('#hide-welcome-page-btn');

welcomePageContainer.addEventListener("click", function (event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan rộng đến document
});

// Create a loading page for threeJS app
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (url, item, total) => {
	labelProgressBar.innerHTML = 'Start Loading...';
}

loadingManager.onProgress = function(url, loaded, total) {
	let loadedValue = ((loaded / total) * 100).toFixed(2);
	labelProgressBar.innerHTML = `Loading... ${loadedValue}%`
	progressBar.value = loadedValue;
}

loadingManager.onLoad = function() {
	progressBarContainer.style.display = 'none';
	hideButton.style.display = 'block';
}

hideButton.addEventListener('click', () => {
	welcomePageContainer.style.display = 'none';
})

////// END WELCOME PAGE

let scene, camera, renderer, controls, controls2, gui;
const loader = new GLTFLoader(loadingManager).setPath('./public/');

const textureLoader = new THREE.TextureLoader(loadingManager).setPath('./public/');


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
    const controls2 = setupControls();

    // ROOM
    var room = createRoom(500, 400, 300, 4,);
    scene.add(room)

    // Light fixture geometry
    const fixtureGeometry = new THREE.BoxGeometry(6, 2, 6); // Adjust size as needed
    const fixtureMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // White color for fixture
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    fixture.name = 'fixture';
    fixture.position.set(-73, 60, 0); // Position the fixture on the left wall
    // AMBIENT LIGHT 
    var ambientLight = createAmbientLight(2, 'rgb(255, 255, 255)');
    ambientLight.position.copy(fixture.position); // Position the light at the same position as the fixture
    ambientLight.add(fixture);
    ambientLight.name = 'ambientLight';
    room.add(ambientLight);

    // FISH TANK
    let tankHeight = 200;
    let tankWidth = 170;
    let tankDepth = 200;
    const fishTank = createFishTank(tankWidth, tankHeight, tankDepth);
    fishTank.position.y -= tankHeight / 2 - 6;
    fishTank.position.z += 50;
    fishTank.name = 'fishTank'

    // !!! CODE HERE
    // Add Objects to the scene
    // Con cá trong bể bơi thì thêm vào fishTank
    // const fishName = createFishName();
    // fishTank.add(fishName);

    // đồ ngoại cảnh thì thêm vào scene
    // Thêm blue whale vào hồ
    const BlueWhale = createBlueWhale(controls, controls2);
    BlueWhale.scale.set(0.06, 0.06, 0.06);
    BlueWhale.position.x = 123 - 100;
    BlueWhale.position.y = 123 - 100;
    BlueWhale.position.z -= 100;
    BlueWhale.name = 'BlueWhale';
    fishTank.add(BlueWhale);

    // Thêm cá vàng Ryukin
    const RyukinGoldfish = createRyukinGoldfish();
    RyukinGoldfish.name = 'RyukinGoldFish';
    RyukinGoldfish.scale.set(2, 2, 2);
    RyukinGoldfish.position.y = 25;
    RyukinGoldfish.position.x += 40;
    RyukinGoldfish.position.z -= 100;
    fishTank.add(RyukinGoldfish);


    // END CODE
    scene.add(fishTank);

    // Thêm sứa
    const SpottedJellyfish = createSpottedJellyfish();
    SpottedJellyfish.name = 'SpottedJellyfish';
    SpottedJellyfish.scale.set(12, 12, 12);
    SpottedJellyfish.position.y = 15;
    SpottedJellyfish.position.x -= 60;
    SpottedJellyfish.position.z -= 100;
    fishTank.add(SpottedJellyfish);


    //Thêm cua
    const Crab = createCrab();
    Crab.name = 'Crab';
    Crab.scale.set(3, 3, 3);
    Crab.position.x = 0;
    Crab.position.y = -25;
    Crab.position.z -= 100;
    fishTank.add(Crab);

    //Thêm Orca
    const Orca = createOrca();
    Orca.name = 'Orca';
    fishTank.add(Orca);


    //Thêm Turtle
    const Turtle = createTurtle();
    Turtle.name = 'Turtle';
    fishTank.add(Turtle);

    handleAnimalClick(BlueWhale, 'BlueWhale');
    handleAnimalClick(Crab, 'Crab');
    handleAnimalClick(Orca, 'Orca');
    handleAnimalClick(Turtle, 'Turtle');
    handleAnimalClick(SpottedJellyfish, 'SpottedJellyfish');
    handleAnimalClick(RyukinGoldfish, 'RyukinGoldFish');


    // TABLE
    const table = createTable();
    table.position.y -= 150 - 25;
    table.position.z += 110;
    table.position.x -= 30;
    table.name = 'table';
    scene.add(table);

    // LIGHTING
    var directionalLight = createDirectionalLight(1);
    directionalLight.intensity = 5;
    scene.add(directionalLight);
    // Create a helper to visualize the directional light's view and frustum
    const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        10
    );
    // directionalLight.position.copy();
    directionalLight.target.position.copy(directionalLightHelper.position);
    directionalLight.name = 'directionalLight';
    directionalLight.add(directionalLightHelper);
    // LAMP
    const myLamp = createLamp();
    myLamp.position.y += 2;
    myLamp.position.z += 10;
    myLamp.position.x -= 17;
    myLamp.name = 'lampOnTheTable';
    table.add(myLamp);
    // see direction of directional light
    // scene.add(new THREE.CameraHelper(directionalLight.shadow.camera)) 
    directionalLight.shadowCameraVisible = true;
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
    update();
    // responsive
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log(scene);
    return scene;
}

function createBlueWhale(controls, controls2) {
    const BlueWhale = new THREE.Group();

    let mixer;
    let mesh;

    // Load model
    loader.load('blue_whale/scene.gltf', (gltf) => {
        console.log('Đang tải model BlueWhale');
        mesh = gltf.scene;
        mesh.scale.set(0.85, 0.85, 0.85);

        mixer = new THREE.AnimationMixer(mesh);
        // Associate animations with the mixer and play them
        gltf.animations.forEach((animation) => {
            mixer.clipAction(animation).play();
        });

        // Thêm mesh vào nhóm BlueWhale
        BlueWhale.add(mesh);
		console.log("Đã tải model BlueWhale");

        const points = [
            new THREE.Vector3(-1000, 0, -15), // điểm bên trái ở ngoài
            new THREE.Vector3(-1000, 0, -1000), // điểm bên trái ở trong
            new THREE.Vector3(1000, 0, -500), // điểm bên phải ở trong
            new THREE.Vector3(1000, 0, -15), // điểm bên phải ở ngoài
        ];

        const path = new THREE.CatmullRomCurve3(points, true);

        function animate(time) {
            const target = controls.target;
            controls.update();
            controls2.target.set(target.x, target.y, target.z);
            controls2.update();

            if (mesh) {
                const t = (time / 8000 % 6) / 6; // chỉnh speed 
                const position = path.getPointAt(t);
                mesh.position.copy(position);

                // Tính toán vector hướng giữa các điểm trong mảng points
                const index = Math.floor(t * (points.length - 1));
                const direction = new THREE.Vector3().copy(points[index + 1]).sub(points[index]).normalize();

                // Tính toán góc xoay của mesh dựa trên hướng vector và mềm dần góc quay
                const targetRotationY = Math.atan2(-direction.z, direction.x) + Math.PI / 5; // Quay mesh 180 độ
                const currentRotationY = mesh.rotation.y;
                const rotationSpeed = 0.00008; // Tốc độ quay

                // Mềm dần góc quay
                mesh.rotation.y += rotationSpeed * (targetRotationY - currentRotationY);
            }

            requestAnimationFrame(animate);

            // // Update the animation mixer
            if (mixer) {
                mixer.update(0.00006);
            }

        }
        renderer.setAnimationLoop(animate)
    });
    

    return BlueWhale;
}

function createRyukinGoldfish() {
    const Ryukin = new THREE.Group();
    let mixer;
    let object;

	console.log('Đang tải model RyukinGoldfish');

  ;
    loader.load(
        `ryukin_goldfish/scene.gltf`,
        function (gltf) {
            object = gltf.scene;
            mixer = new THREE.AnimationMixer(object);
            gltf.animations.forEach((animation) => {
                mixer.clipAction(animation).play();
            });
            Ryukin.add(object);
            // Tạo quỹ đạo 3D
            const curve = new THREE.CatmullRomCurve3(
                [
                    new THREE.Vector3(-7.5, -7.5, -7.5),
                    new THREE.Vector3(7.5, 0, 7.5),
                    new THREE.Vector3(6, 7.5, -4),
                    new THREE.Vector3(-4, 4, 7.5),
                    new THREE.Vector3(-7.5, -7.5, -7.5),
                ],
                true
            );
            let speed = 0.003;
            let time = 0;
            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                // time += delta;
                time += speed;
                const t = time % 1; // t từ 0 đến 1
                const position = curve.getPointAt(t);
                object.position.copy(position);

                const index = Math.floor(t * (curve.points.length - 1));
                const direction = new THREE.Vector3()
                    .copy(curve.points[(index + 1) % curve.points.length])
                    .sub(curve.points[index])
                    .normalize();

                const targetRotationY =
                    Math.atan2(-direction.z, direction.x) + Math.PI / 5;
                const currentRotationY = object.rotation.y;
                const rotationSpeed = 0.045; // chỉnh tốc độ quay

                object.rotation.y +=
                    rotationSpeed * (targetRotationY - currentRotationY);

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
  
	console.log("Đã tải model Ryukin");

	return Ryukin;
}

function createSpottedJellyfish() {
    const SpottedJellyfish = new THREE.Group();

    let mixer;
    let object;
	
	
	console.log('Đang tải model SpottedJellyfish');
  ;
    loader.load(
        `simple_spotted_jellyfish_baked_animation/scene.gltf`,
        function (gltf) {
            object = gltf.scene;

            mixer = new THREE.AnimationMixer(object);
            gltf.animations.forEach((animation) => {
                mixer.clipAction(animation).play();
            });

            SpottedJellyfish.add(object);

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

	console.log("Đã tải model SpottedJellyfish");

    return SpottedJellyfish;
}

function createCrab() {
    const Crab = new THREE.Group();

    let mixer;
    let mesh;

    // Load model
    loader.load('animated_crab/scene.gltf', (gltf) => {
        console.log('Đang tải model Crab');
        mesh = gltf.scene;
        mesh.scale.set(3.5, 3.5, 3.5);
        mesh.rotation.x = Math.PI / 8;

        mixer = new THREE.AnimationMixer(mesh);
        // Associate animations with the mixer and play them
        gltf.animations.forEach((animation) => {
            mixer.clipAction(animation).play();
        });

        // Thêm mesh vào nhóm JellyFish
        Crab.add(mesh);
        console.log('Đã tải model crab');

        let upward = true; // Biến để xác định hướng di chuyển

        function animate() {
            // Di chuyển mesh lên và xuống
            const amplitude = 25; // Biên độ di chuyển
            const speed = 0.08; // Tốc độ di chuyển

            if (upward) {
                mesh.position.x += speed;
            } else {
                mesh.position.x -= speed;
            }

            // Đảo hướng di chuyển khi mesh đạt biên độ di chuyển
            if (mesh.position.x >= amplitude || mesh.position.x <= -amplitude) {
                upward = !upward;
            }

            requestAnimationFrame(animate);

            // // Update the animation mixer
            if (mixer) {
                mixer.update(0.03);
            }

        }
        renderer.setAnimationLoop(animate)
    });
    Crab.rotation.x = -Math.PI / 4; // Rotate group by 30 degrees

    return Crab;
}

function createOrca() {
  let fish;
  let mixer;
  console.log('Đang tải model Orca');

  const Orca = new THREE.Group()

  loader.load('female_orca/scene.gltf', function (gltf) {
      fish = gltf.scene
      mixer = new THREE.AnimationMixer(fish);
      gltf.animations.forEach((animation) => {
          mixer.clipAction(animation).play();
      });
      Orca.add(fish)
      Orca.matrixAutoUpdate = false
      const entityManager = new YUKA.EntityManager()
      const time = new YUKA.Time()
      const swim = new YUKA.Vehicle()
      swim.setRenderComponent(Orca, sync)

        const path = new YUKA.Path()
        const x = -60;
        const y = -130;
        const z = 50;
        path.loop = true
        path.add(new YUKA.Vector3(0 + x, 2 + z, 8 + y))
        path.add(new YUKA.Vector3(-2 + x, -2 + z, 4 + y))
        path.add(new YUKA.Vector3(0 + x, 2 + z, 0 + y))
        path.add(new YUKA.Vector3(4 + x, 0 + z, 4 + y))
        path.add(new YUKA.Vector3(8 + x, -2 + z, 0 + y))
        path.add(new YUKA.Vector3(10 + x, 2 + z, 4 + y))
        path.add(new YUKA.Vector3(8 + x, 0 + z, 8 + y))
        path.add(new YUKA.Vector3(4 + x, 0 + z, 10 + y))

        swim.position.copy(path.current())

        const followPathBehavior = new YUKA.FollowPathBehavior(path, 1)
        swim.steering.add(followPathBehavior)
        const onPathBehavior = new YUKA.OnPathBehavior(path, 0.5)
        swim.steering.add(onPathBehavior)
        entityManager.add(swim)
        function animate() {
            requestAnimationFrame(animate)
            const delta = time.update().getDelta()
            if (mixer) {
                mixer.update(0.1);
            }
            entityManager.update(delta)
        }
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix)
        }
        animate()
    }
  )
  console.log("Đã tải model Orca");

  return Orca
}

function createTurtle() {
  let fish;
  let mixer;
  console.log('Đang tải model Turtle');
  const Turtle = new THREE.Group()

  loader.load('sea_turtle/scene.gltf', function (gltf) {
      fish = gltf.scene
      fish.scale.set(2, 2, 2);
      mixer = new THREE.AnimationMixer(fish);
      gltf.animations.forEach((animation) => {
          mixer.clipAction(animation).play();
      });
      Turtle.add(fish)

        Turtle.matrixAutoUpdate = false
        scene.add(Turtle)

        const entityManager = new YUKA.EntityManager()
        const time = new YUKA.Time()
        const dive = new YUKA.Vehicle()

        dive.setRenderComponent(Turtle, sync)

        const path = new YUKA.Path()
        const x = 80;
        const y = -100;
        const z = -100
        path.loop = true
        path.add(new YUKA.Vector3(0 + x, 2 + z, 8 + y))
        path.add(new YUKA.Vector3(-2 + x, -2 + z, 4 + y))
        path.add(new YUKA.Vector3(0 + x, 2 + z, 0 + y))
        path.add(new YUKA.Vector3(4 + x, 0 + z, 4 + y))
        path.add(new YUKA.Vector3(8 + x, -2 + z, 0 + y))
        path.add(new YUKA.Vector3(10 + x, 2 + z, 4 + y))
        path.add(new YUKA.Vector3(8 + x, 0 + z, 8 + y))
        path.add(new YUKA.Vector3(4 + x, 0 + z, 10 + y))

        dive.position.copy(path.current())

        const followPathBehavior = new YUKA.FollowPathBehavior(path, 1)
        dive.steering.add(followPathBehavior)
        const onPathBehavior = new YUKA.OnPathBehavior(path, 0.5)
        dive.steering.add(onPathBehavior)
        entityManager.add(dive)
        function animate() {
            requestAnimationFrame(animate)
            const delta = time.update().getDelta()
            if (mixer) {
                mixer.update(0.02);
            }
            entityManager.update(delta)
        }
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix)
        }
        animate()
    }
  )
  console.log("Đã tải model Turtle");
  return Turtle
}

function setupDirectionalLightControls(directionalLight, parentFolder = None) {
    if (!parentFolder) {
        parentFolder = gui;
    }
    var directionalLightFolder = parentFolder.addFolder("Directional Light");
    let directionalLightVisible = true; // Initial state of ambient light visibility
    directionalLightFolder
        .add({ visible: directionalLightVisible }, "visible")
        .onChange((value) => {
            directionalLightVisible = value;
            directionalLight.visible = directionalLightVisible; // Toggle ambient light visibility
        });

    var posDirectionalLightControls = directionalLightFolder.addFolder('Position');
    // var rotDirectionalLightControls = directionalLightFolder.addFolder('Rotation');
    directionalLightFolder.add(directionalLight, 'intensity', 0, 10).name('Intensity');
    directionalLightFolder.addColor(directionalLight, 'color').name('Color');
    posDirectionalLightControls.add(directionalLight.position, 'x', -90, 90);
    posDirectionalLightControls.add(directionalLight.position, 'y', -100, 100);
    posDirectionalLightControls.add(directionalLight.position, 'z', -50, 50);
    // rotDirectionalLightControls.add(directionalLight.rotation, 'x', -3.14, 3.14);
    // rotDirectionalLightControls.add(directionalLight.rotation, 'y', -3.13, 3.14);
    // rotDirectionalLightControls.add(directionalLight.rotation, 'z', -3.14, 3.14);
}

function setupAmbientLightControls(ambientLight, parentFolder = None) {
    if (!parentFolder) {
        parentFolder = gui;
    }
    var ambientLightControls = parentFolder.addFolder("Ambient Light");
    ambientLightControls.add(ambientLight, "intensity", 0, 2).name("Intensity");

    // turn on and off
    let ambientLightVisible = true; // Initial state of ambient light visibility
    ambientLightControls
        .add({ visible: ambientLightVisible }, "visible")
        .onChange((value) => {
            ambientLightVisible = value;
            ambientLight.visible = ambientLightVisible; // Toggle ambient light visibility
        });
    ambientLightControls.add(ambientLight.position, 'z', -120, 120);
}

function setupSpotLightControls(spotLight, parentFolder = None) {
    if (!parentFolder) {
        parentFolder = gui;
    }

    // Spot Light Controls
    var spotLightFolder = parentFolder.addFolder("Spot Light");
    let spotLightVisible = true; // Initial state of ambient light visibility
    spotLightFolder
        .add({ visible: spotLightVisible }, "visible")
        .onChange((value) => {
            spotLightVisible = value;
            spotLight.visible = spotLightVisible; // Toggle ambient light visibility
        });

    var posSpotLightControls = spotLightFolder.addFolder("Position");
    var rotSpotLightControls = spotLightFolder.addFolder("Rotation");
    spotLightFolder.add(spotLight, "intensity", 0, 10).name("Intensity");
    spotLightFolder.addColor(spotLight, "color").name("Color");
    // spotLightFolder.add(spotLight, 'penumbra', 0, 1);
    posSpotLightControls.add(spotLight.position, "x", -22, 22);
    posSpotLightControls.add(spotLight.position, "y", -50, 100);
    posSpotLightControls.add(spotLight.position, "z", -13, 13);
    rotSpotLightControls.add(spotLight.rotation, "x", -1, 1);
    rotSpotLightControls.add(spotLight.rotation, "y", -1, 1);
    rotSpotLightControls.add(spotLight.rotation, "z", -1, 1);
}

// returns a room 
function createRoom(width, length, height, thickness, texturePath = '') {
    const room = new THREE.Group();
    let defaultColor = 'rgb(199, 199, 255)';

    // Wall material
    let wallMaterial;
    if (texturePath) {
        // Create a material with the loaded texture
        wallMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(texturePath), // Use the texture for color
            side: THREE.DoubleSide, // Ensure texture is visible on both sides of the wall
        });
    }
    else {
        wallMaterial = new THREE.MeshStandardMaterial({
            color: defaultColor,
        });
    }

    // Floor
    const floorGeometry = new THREE.BoxGeometry(length, thickness, width);
    const floor = new THREE.Mesh(floorGeometry, wallMaterial);
    floor.position.y = -height / 2;
    floor.receiveShadow = true;
    floor.castShadow = true;
    room.add(floor);

    // Left Wall
    const leftWallGeometry = new THREE.BoxGeometry(thickness, height, width);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -length / 2;
    // leftWall.position.y = height/2;
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    room.add(leftWall);

    // Back Wall
    const backWallGeometry = new THREE.BoxGeometry(length, height, thickness);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -width / 2;
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    room.add(backWall);

    // GUI controls object
    const wallControls = {
        'Wall textures': texturePath || '',
        'Wall color': defaultColor,
    };
    gui.add(wallControls, 'Wall textures', {
        Wood: 'textures/wooden.jpg',
        Rocky: 'textures/rocky.jpg',
        Brick: 'textures/brick.jpg',
        'Gray Brick': 'textures/graybricks.jpg',
    }).onChange(function(value) {
        // Update wall texture when GUI control changes
        wallMaterial.map = textureLoader.load(value);
        wallMaterial.needsUpdate = true;
    });

    gui.addColor(wallControls, 'Wall color').onChange(function (value) {
        // Update wall color when GUI control changes
        wallMaterial.color.set(value);
    });

    return room;
}

function createFishTank(tankWidth = 170, tankHeight = 200, tankDepth = 200) {
    const fishTank = new THREE.Group();

	console.log('Đang tải model FishTank')
    // Load fish tank model
    loader.load("/cage/glass_cage.glb", function (gltf) {
        const fishTankModel = gltf.scene;
        fishTankModel.name = "tank";
        fishTankModel.scale.set(
            tankWidth, // Example scale factor for width
            tankHeight, // Example scale factor for height
            tankDepth  // Example scale factor for thickness
        );

        fishTankModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

		console.log("Đã tải model FishTank");

        const glass = fishTankModel.getObjectByName("Cube_2");
        glass.name = "tank-glass";
        glass.material.transparent = true;
        glass.material.opacity = 0.1;

        const waterSurface = createWaterSurface(30, 30, 0.0335);
        const water = createWater(1.85);
        const corals = createCorals();

        waterSurface.position.y = water.geometry.parameters.height / 2;
        water.add(corals);

        water.add(waterSurface);
        glass.add(water);

        fishTank.add(fishTankModel);
    });

    fishTank.castShadow = true;
    fishTank.receiveShadow = true;
    return fishTank;
}

function createWaterSurface(width = 30, height = 30, scale = .06) {
    const waterColor = 0x0189F9;
    const geometry = new THREE.PlaneGeometry(width, height, 300, 300);
    const waterSurfaceMaterial = new THREE.MeshPhysicalMaterial({
        color: waterColor, // Use the same color as the water
        transmission: 0.7,
        roughness: 0.1,
    });
    const waterSurface = new Water(geometry, waterSurfaceMaterial);
    waterSurface.name = "water_surface";
    waterSurface.receiveShadow = true;
    waterSurface.castShadow = true;
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.scale.set(scale, scale, scale);
    waterSurface.matrixAutoUpdate = true;
    
    const positionAttribute = waterSurface.geometry.getAttribute( 'position' );
    
    function animate() {
        requestAnimationFrame(animate);
        
        const damping = 0.25;
        const now_slow = Date.now() / 400;
        const count = positionAttribute.count;
        positionAttribute.needsUpdate = true; 

        // tạo sóng
        for (let i = 0; i < count; i++) {

            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            
            const xangle = x + now_slow;
            const xsin = Math.sin(xangle) * damping;
            
            const yangle = y + now_slow;
            const ycos = Math.cos(yangle) * damping;
            positionAttribute.setZ(i, xsin + ycos);
        }
    }

    renderer.setAnimationLoop(animate)
    
    return waterSurface;
}

function createWater(scale = 1.0) {
    const waterColor = 0x0189F9; // Blue color for water

    // Create a box geometry or any other geometry representing water
    const waterGeometry = new THREE.BoxGeometry(1, 1, 1); // Adjust size as needed

    // Create a material for the water (transparent and blue color)
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: waterColor,
        transparent: true,
        transmission: 0.5,
        roughness: 0.1,
        opacity: 0.4, // Adjust opacity as needed
    });

    // Create the water mesh using the geometry and material
    const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
    waterMesh.name = "water";

    // Adjust position and scale of the water mesh
    waterMesh.scale.set(scale, scale, scale);
    waterMesh.position.y -= 0.2;

    return waterMesh;
}

function createCorals(numberOfCorals = 35, scale = .003) {
    const corals = new THREE.Group();
    corals.name = 'corals';
	console.log('Đang tải model Corals')
    // Helper function to change coral color
    function changeCoralColor(coralModel, color) {
        coralModel.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }

    const coralModels = [
        "/corals/Coral0.glb",
        "/corals/Coral1.glb",
        "/corals/Coral2.glb",
        "/corals/Coral3.glb",
        "/corals/Coral4.glb",
        "/corals/Coral5.glb",
        "/corals/Coral6.glb",
    ];

    // fixed corals
    // yellow one
    loader.load("/corals/Coral0.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale + 0.003, scale + 0.003, scale + 0.003);
        coralModel.position.x = 0.38;
        coralModel.position.y = -0.44;
        coralModel.position.z = -0.4;
        changeCoralColor(coralModel, 0x00ee00);
        corals.add(coralModel);
    });

    // red one
    loader.load("/corals/Coral1.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale + 0.006, scale + 0.006, scale + 0.006);
        coralModel.position.x = 0.28;
        coralModel.position.y = -0.4;
        coralModel.position.z = 0.2;
        coralModel.rotation.y = Math.PI;
        changeCoralColor(coralModel, 0xfab500);
        corals.add(coralModel);
    });

    loader.load("/corals/Coral2.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = -0.32;
        coralModel.position.y = -0.5;
        coralModel.position.z = -0.2;
        changeCoralColor(coralModel, 0xff5b00);
        corals.add(coralModel);
    });

    loader.load("/corals/Coral3.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale, scale, scale);
        coralModel.position.x = 0.32;
        coralModel.position.y = -0.4;
        coralModel.position.z = 0.4;
        changeCoralColor(coralModel, 0xffff00);
        corals.add(coralModel);
    });

    loader.load("/corals/Coral4.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale + 0.006, scale + 0.006, scale + 0.006);
        coralModel.position.x = -0.37;
        coralModel.position.y = -0.5;
        coralModel.position.z = -0.3;
        coralModel.rotation.y = -0.5;
        changeCoralColor(coralModel, 0x051094);
        corals.add(coralModel);
    });

    loader.load("/corals/Coral5.glb", function (gltf) {
        const coralModel = gltf.scene;
        coralModel.scale.set(scale + 0.002, scale + 0.001, scale + 0.003);
        coralModel.position.x = -0.4;
        coralModel.position.y = -0.45;
        coralModel.rotation.y = -0.5;
        coralModel.position.z = 0.39;
        changeCoralColor(coralModel, 0xff1ff4);
        corals.add(coralModel);
    });

    loader.load("/corals/Coral6.glb", function (gltf) {
        const coralModel = gltf.scene;
        const rScale = THREE.MathUtils.randFloat(-(scale + 0.002), scale + 0.001);
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
				const posX = THREE.MathUtils.randFloat(-0.4, 0.4); // Adjust range as needed
				const posY = -0.4;
				const posZ = THREE.MathUtils.randFloat(-.42, .42); // Adjust range as needed
				coralModel.position.set(posX, posY, posZ);
				coralModel.rotation.y = THREE.MathUtils.randFloat(-Math.PI, Math.PI);

			// Change coral color if needed
			const randomColor = Math.random() * 0xffffff;
			changeCoralColor(coralModel, randomColor);

			corals.add(coralModel);

			// Check if all corals have been loaded
			if (corals.children.length === numberOfCorals) {
				// All corals are loaded
				console.log("Đã tải model Corals");
			}
        });
    }

    return corals;
}

function createTable(tableWidth = 50, tableLength = 50, tableThickness = 2, legWidth = 2, legHeight = 25, legDepth = 2, scale = 1.0) {
    const table = new THREE.Group();

    // Table top
    const texture = textureLoader.load('textures/wooden.jpg'); 
    const material = new THREE.MeshPhysicalMaterial({
        map: texture, // Use the texture for color
        side: THREE.DoubleSide, // Ensure texture is visible on both sides of the wall
    });
    const tableTopGeometry = new THREE.BoxGeometry(tableWidth, tableThickness, tableLength);
    const tableTop = new THREE.Mesh(tableTopGeometry, material);
    tableTop.castShadow = true; // Enable shadow casting
    tableTop.receiveShadow = true; // Enable shadow receiving
    table.add(tableTop);

    // Leg 1
    const leg1Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg1 = new THREE.Mesh(leg1Geometry, material);
    leg1.position.set(-(tableWidth / 2 - 5), -(legHeight / 2), -(tableLength / 2 - 3));
    leg1.castShadow = true;
    leg1.receiveShadow = true;
    table.add(leg1);

    // Leg 2
    const leg2Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg2 = new THREE.Mesh(leg2Geometry, material);
    leg2.castShadow = true;
    leg2.receiveShadow = true;
    leg2.position.set((tableWidth / 2 - 5), -(legHeight / 2), -(tableLength / 2 - 3));
    table.add(leg2);

    // Leg 3
    const leg3Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg3 = new THREE.Mesh(leg3Geometry, material);
    leg3.castShadow = true;
    leg3.receiveShadow = true;
    leg3.position.set(-(tableWidth / 2 - 5), -legHeight / 2, (tableLength / 2 - 3));
    table.add(leg3);

    // Leg 4
    const leg4Geometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
    const leg4 = new THREE.Mesh(leg4Geometry, material);
    leg4.castShadow = true;
    leg4.receiveShadow = true;
    leg4.position.set((tableWidth / 2 - 5), -legHeight / 2, (tableLength / 2 - 3));
    table.add(leg4);

    table.scale.set(scale, scale, scale);
    return table;
}

function createLamp(scale = 1.0) {
    const lamp = new THREE.Group();

    // Lamp base
    const baseGeometry = new THREE.BoxGeometry(4, 1, 4);
    const baseMaterial = new THREE.MeshPhysicalMaterial({ color: 0x606060 }); // Gray color
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    lamp.add(base);

    // Lamp stand
    const standGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
    const standMaterial = new THREE.MeshPhysicalMaterial({ color: 0x606060 }); // Gray color
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 10; // Position the stand above the base
    lamp.add(stand);
    stand.castShadow = true;
    stand.receiveShadow = true;

    // Lamp shade
    const shadeGeometry = new THREE.ConeGeometry(6, 12, 32);
    const shadeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFFF00 }); // Yellow color
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.y = 20; // Position the shade above the stand
    shade.castShadow = true;
    shade.receiveShadow = true;
    lamp.add(shade);
    lamp.scale.set(scale, scale, scale);

    return lamp;
}

function createDirectionalLight(intensity, color = 0xffffff) {
    var light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;

    // Configure shadow parameters
    light.shadow.mapSize.width = 100; // Set shadow map width (higher resolution)
    light.shadow.mapSize.height = 100; // Set shadow map height (higher resolution)
    light.shadow.camera.near = 1; // Near plane of the shadow camera
    light.shadow.camera.far = 50; // Far plane of the shadow camera
    light.shadow.camera.left = -100; // Left frustum edge
    light.shadow.camera.right = 100; // Right frustum edge
    light.shadow.camera.top = 200; // Top frustum edge
    light.shadow.camera.bottom = -200; // Bottom frustum edge
    light.shadow.bias = -0.001; // Bias to avoid shadow acne
    light.shadow.camera.visible = true; // Show the shadow camera helper
    light.shadowDarkness = 0.5;
    return light;
}

function createAmbientLight(intensity, color = 0xffffff) {
    var light = new THREE.AmbientLight(color, intensity);
    return light;
}

function createSpotLight(intensity, color = 0xffffff, angle = Math.PI / 6) {
    var light = new THREE.SpotLight(color, intensity);
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
    renderer.setClearColor("rgb(100, 100, 100)");
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMapSoft = true;

    return renderer;
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(
        75,
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
    controls.maxDistance = 800;
    controls.update();
    return controls;
}

function update() {
    // Render the scene
    renderer.render(scene, camera);

    // controls.update();
    // handle the render of the scene
    requestAnimationFrame(update);
}


var infoPanel = document.createElement("div");
infoPanel.style.position = "absolute";
infoPanel.style.background = "rgba(255,255,255,0.8)";
infoPanel.style.padding = "10px";
infoPanel.style.whiteSpace = "pre-line";
document.body.appendChild(infoPanel);
// không cho click trên infoPanel ảnh hưởng tới body
infoPanel.addEventListener('Click', e => {
    e.stopPropagation();
})

function showInfoPanel(x, y, z, t, object) {
    // Lấy vị trí thế giới của vật thể
    var objectWorldPosition = new THREE.Vector3();
    object.getWorldPosition(objectWorldPosition);

    // Chuyển đổi vị trí thế giới thành vị trí màn hình
    var vector = objectWorldPosition.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight;

    infoPanel.style.top = vector.y + "px";
    infoPanel.style.left = vector.x + "px"; 

    infoPanel.textContent =
        "Thông tin sinh vật: \n" +
        "Tên: " +
        y +
        "\n" +
        "Nơi sống: " +
        z +
        "\n" +
        "Tuổi thọ trung bình: " +
        t;

    if (infoPanel.style.display !== 'block') {
        infoPanel.style.display = "block";
    }
    
    // hide the info panel when the user clicks anywhere OUTSIDE infoPanel
    document.addEventListener("click", function (event) {
        if (event.target !== infoPanel && 
            infoPanel.style.display !== "none") {
            infoPanel.style.display = "none";
        } 
    });
}

const objectInfoDict = {};
fetch('info.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(info => {
                objectInfoDict[info.name] = info;
            });
        })
        .catch(error => console.error('No info', error));

function handleAnimalClick(animal, animalName) {
    addEventListener('click', function (event) {
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObject(animal);
        if (intersects.length > 0) {
            const objectInfo = objectInfoDict[animalName];
            if (objectInfo) {
                showInfoPanel(objectInfo.name, objectInfo.displayName, objectInfo.location, objectInfo.lifespan, animal);
            }
        }
    });
}



init();
