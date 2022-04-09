import * as THREE from "../node_modules/three/build/three.module.js";
// import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
const renderer = new THREE.WebGLRenderer({antialias: true});
camera.position.z = 5;

renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
const boxMesh = new THREE.Mesh(boxGeometry,
    boxMaterial);
boxMesh.rotation.set(40, 0, 40);
scene.add(boxMesh);

const rendering = function() {
    requestAnimationFrame(rendering);
    // Constantly rotate box
    scene.rotation.z -= 0.005;
    scene.rotation.x -= 0.01;
    renderer.render(scene, camera);
};

const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

rendering();
