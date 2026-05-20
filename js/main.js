import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');

// Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcbd5e1)

const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1, 
    1000
);
camera.position.z = 18

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
let model = null; 
let isWireframe = false;
let lightOn = true;
let spinning = false;

function loadModel(filename) {
    if (model) {
        scene.remove(model);
        model = null;
    }

    loader.load(filename, function(gltf) {
        model = gltf.scene;
        scene.add(model);

        if (isWireframe) {
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.material.wireframe = true;
                }
            });
        }

        console.log("loaded", filename);
    }, undefined, function(error) {
        console.log("didnt load", filename, error);
    });
}

// load Red Bull when page loads
loadModel('models/RedBull.glb');

document.getElementById('btn-redbull').addEventListener('click', function() {
    loadModel('models/RedBull.glb');
    document.getElementById('description').innerHTML = `
        <h2>Red Bull</h2>
        <p>Red Bull is an Austrian energy drink first sold in 1987. Containing caffeine, taurine, and B-vitamins, it's the world's best-selling energy drink. 
        The brand is also known for its sponsorship of extreme sports and motorsport teams.</p>
    `;
});

document.getElementById('btn-monster').addEventListener('click', function() {
    loadModel('models/Monster.glb');
    document.getElementById('description').innerHTML = `
        <h2>Monster</h2>
        <p>Monster Energy is an American energy drink launched in 2002 by Hansen Natural. 
        Sold in distinctive 500ml cans with the green claw logo, it's the second-largest energy drink brand globally. 
        The range includes dozens of flavour variants and zero-sugar editions.</p>
    `;
});

document.getElementById('btn-prime').addEventListener('click', function() {
    loadModel('models/Prime.glb');
    document.getElementById('description').innerHTML = `
        <h2>Prime</h2>
        <p>Prime is an energy and hydration drink brand founded in 2022 by content creators KSI and Logan Paul. 
        Originally launched as Prime Hydration, the energy line followed in 2023. 
        The brand became known for high-demand product drops and viral marketing.</p>
    `;
});

// lights 
scene.add(new THREE.AmbientLight(0xffffff, 2));
const keyLight = new THREE.DirectionalLight(0xffffff, 4);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// render loop
function animate() {
  controls.update();
  requestAnimationFrame(animate);

  if (spinning && model) {
    model.rotation.y += 0.025;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});


document.getElementById('btn-wireframe').addEventListener('click', function() {
    isWireframe = !isWireframe;

    if (model) {
        model.traverse(function(child) {
            if (child.isMesh) {
                child.material.wireframe = isWireframe;
            }
        });
    }
});

document.getElementById('btn-light').addEventListener('click', function() {
    lightOn = !lightOn;
    keyLight.intensity = lightOn ? 4 : 0;
});

document.getElementById('btn-spin').addEventListener('click', function() {
    spinning = true;
    setTimeout(function() {
        spinning = false;
    }, 2000); 
});