//Vẽ điểm sáng toàn cục
function drawLightPoint() {
    var lightPoint = new THREE.PointLight(0xffffff, 1, 100);
    lightPoint.position.set(0, 0, 0);
    scene.add(lightPoint);
}
