import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Set background
// scene.background = new THREE.TextureLoader().load( "public/background.jpg" );

const _geo_checkpoint = new THREE.BoxGeometry( 50, 30, 0.01 );
const _background_material_0 = new THREE.MeshLambertMaterial( { color: 0x26547C } );
const _background_material_1 = new THREE.MeshLambertMaterial( { color: 0xEF476F } );
const _background_material_2 = new THREE.MeshLambertMaterial( { color: 0xFFD166 } );
const _checkpoint_0 = new THREE.Mesh( _geo_checkpoint, _background_material_0 );
const _checkpoint_1 = new THREE.Mesh( _geo_checkpoint, _background_material_1 );
const _checkpoint_2 = new THREE.Mesh( _geo_checkpoint, _background_material_2 );
_checkpoint_0.translateZ(-10);
_checkpoint_1.translateZ(-10 + 100);
_checkpoint_2.translateZ(-10 + 200);
scene.add( _checkpoint_0 );
scene.add( _checkpoint_1 );
scene.add( _checkpoint_2 );

// Add lights
const ambient_light = new THREE.AmbientLight();
scene.add( ambient_light );

const point_light2 = new THREE.PointLight(0xFFD166, 20)
point_light2.position.set(-0.8, -1.4, 1.0)
scene.add(point_light2)

// Start renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add orbit controls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 0, -1)

// controls.mouseButtons = {
//     LEFT: null,
//     RIGHT: null
// };

// Add text
const text_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
addText("Home", text_material, scene, 0.5, [0, 0, -2]);
addText("About", text_material, scene, 0.5, [0, 0, -2 + 100]);
addText("Contact", text_material, scene, 0.5, [0, 0, -2 + 200]);

// Add CanGuru model
// const fbxLoader = new FBXLoader()
// fbxLoader.load(
//     "public/models/Bomb.fbx",
//     // "public/models/CanGuru.fbx",
//     (object) => {
//         scene.add(object)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )

// On resize, re-render
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    // controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()


function addText(_text, _material, _scene, _size=1, _position=[0, 0, 0]) {
    const loader = new FontLoader();
    loader.load( 'fonts/Roboto_Bold.json', function ( font ) {
        const _geometry = new TextGeometry(_text, {
            font: font,
            size: _size,
            depth: _size/10,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: _size/10,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        } );
        let _obj = new THREE.Mesh( _geometry, _material);
        _obj.position.set(..._position);
        _geometry.center();
        _scene.add( _obj );
    } );
}


let pan_speed = 0.001;
addEventListener("mousemove", (event) => {});
onmousemove = (event) => {
    camera.translateX(event.movementX > 0 ? pan_speed : -pan_speed);
    camera.translateY(event.movementY > 0 ? -pan_speed : pan_speed);
};


let zoom_speed = 0.1;
let checkpoint_distance = 100;
let current_checkpoint = 0;
let checkpoint_offset = 2;
let transition_speed = 5;
let transitioning = false;
addEventListener("wheel", (event) => {});
onwheel = (event) => {
    if (transitioning) return;

    camera.translateZ(event.deltaY > 0 ? zoom_speed : -zoom_speed);
    if (camera.position.z > current_checkpoint + checkpoint_offset) {
        nextCheckpoint();
    }
    else if (camera.position.z < current_checkpoint - checkpoint_offset) {
        previousCheckpoint();
    }
};

function moveCamera(target) {
    console.log("moving camera...")
    transitioning = true;
    let _speed = camera.position.z > target ? -transition_speed : transition_speed;
    let tick = function() {
        camera.translateZ(_speed);
        if (Math.abs(camera.position.z - target) > transition_speed) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
        else {
            camera.position.setZ(target);
            transitioning = false;
        }
    };
    tick();
}

function nextCheckpoint() {
    console.log("Next checkpoint!")
    transitioning = true;
    current_checkpoint += checkpoint_distance;
    moveCamera(current_checkpoint);
}

function previousCheckpoint() {
    console.log("Previous checkpoint!")
    transitioning = true;
    current_checkpoint -= checkpoint_distance;
    moveCamera(current_checkpoint);
}

for (let i = 0; i < 3; i++) {
    document.getElementById("checkpoint_" + i.toString()).onclick = function() {
        moveCamera(i * checkpoint_distance);
    }
};