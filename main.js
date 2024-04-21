import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const i_focalLength = camera.getFocalLength();

// Checkpoints: Vector3 Position + Quartenion Rotation + Focal Length
let current_checkpoint = 0;
const CHECKPOINTS = [
    [new THREE.Vector3(0, 0, 0), new THREE.Quaternion(0, 0, 0, 1), 1],
    [new THREE.Vector3(-2.5, -0.5, 0), new THREE.Quaternion(0, 0, -1, 1), 60],
    [new THREE.Vector3(-2.5075, -0.5125, 0), new THREE.Quaternion(0, 0, 0, 1), 3600],
];
console.log(CHECKPOINTS);

// Set background
// scene.background = new THREE.TextureLoader().load( "public/background.jpg" );

const _geo_checkpoint = new THREE.BoxGeometry( 500, 300, 10 );
const _background_material_0 = new THREE.MeshLambertMaterial( { color: 0x26547C } );
const _checkpoint_0 = new THREE.Mesh( _geo_checkpoint, _background_material_0 );
scene.add( _checkpoint_0 );
_checkpoint_0.position.set(0, 0, -100);


const _geo_checkpoint_1 = new THREE.BoxGeometry( 2.5, 2.5, 0.1 );
const _background_material_1 = new THREE.MeshLambertMaterial( { color: 0xEF476F } );
const _checkpoint_1 = new THREE.Mesh( _geo_checkpoint_1, _background_material_1 );
scene.add( _checkpoint_1 );
_checkpoint_1.position.set(-2.5, -0.5, -20);

const _geo_checkpoint_2 = new THREE.BoxGeometry( 0.026, 0.022, 0.001 );
const _background_material_2 = new THREE.MeshLambertMaterial( { color: 0xFFD166 } );
const _checkpoint_2 = new THREE.Mesh( _geo_checkpoint_2, _background_material_2 );
scene.add( _checkpoint_2 );
_checkpoint_2.position.set(-2.509, -0.51, -19.95);

// const _background_material_1 = new THREE.MeshLambertMaterial( { color: 0xEF476F } );
// const _background_material_2 = new THREE.MeshLambertMaterial( { color: 0xFFD166 } );
// const _checkpoint_1 = new THREE.Mesh( _geo_checkpoint, _background_material_1 );
// const _checkpoint_2 = new THREE.Mesh( _geo_checkpoint, _background_material_2 );
// _checkpoint_1.translateZ(-10 + 100);
// _checkpoint_2.translateZ(-10 + 200);
// scene.add( _checkpoint_1 );
// scene.add( _checkpoint_2 );

// Add lights
const ambient_light = new THREE.AmbientLight();
scene.add( ambient_light );

// const point_light0 = new THREE.PointLight(0xFFD166, 20)
// point_light0.position.set(-1, -2, 1)
// scene.add(point_light0)
// const point_light1 = new THREE.PointLight(0xFFD166, 20)
// point_light1.position.set(-1, -2, 101)
// scene.add(point_light1)
// const point_light2 = new THREE.PointLight(0xFFD166, 20)
// point_light2.position.set(-1, -2, 201)
// scene.add(point_light2)

// Start renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add orbit controls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 0, -20)
// controls.zoomSpeed = 10
// controls.rotateSpeed = 0.01
// controls.panSpeed = 0.01

// Add text
const text_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
addText("Home", text_material, scene, 5, [0, 0, -20]);
addText("About", text_material, scene, 0.05, [-2.5, -0.5, -19.5], [0, 0, -Math.PI/2]);
addText("Contact", text_material, scene, 0.001, [-2.5075, -0.511, -19.5]);

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


function addText(_text, _material, _scene, _size=1, _position=[0, 0, 0], _rotation=[0, 0, 0]) {
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
        _obj.rotation.set(..._rotation);
        _geometry.center();
        _scene.add( _obj );
    } );
}


let i_pan_speed = 0.01;
let i_zoom_speed = 0.05;
let i_checkpoint_offset = 0.5;
let pan_speed = i_pan_speed; 
let checkpoint_offset = i_zoom_speed;
let zoom_speed = i_checkpoint_offset;

function setPanSpeed() {
    pan_speed = i_pan_speed / Math.pow(30, current_checkpoint);
    console.log(pan_speed);
}
function setCheckpointOffset() {
    checkpoint_offset = i_checkpoint_offset / Math.pow(12, current_checkpoint);
}
function setZoomSpeed() {
    zoom_speed = i_zoom_speed / Math.pow(12, current_checkpoint);
}

addEventListener("mousemove", (event) => {});
onmousemove = (event) => {
    camera.translateX(event.movementX > 0 ? pan_speed : -pan_speed);
    camera.translateY(event.movementY > 0 ? -pan_speed : pan_speed);
};


let transitioning = false;
addEventListener("wheel", (event) => {});
onwheel = (event) => {
    if (transitioning) return;
    let _current_checkpoint_z = CHECKPOINTS[current_checkpoint][0].z;

    // if (current_checkpoint == 0 && event.deltaY > 0) return;
    // if (current_checkpoint == CHECKPOINTS.length - 1 && event.deltaY < 0) return;

    if (event.deltaY > 0 && camera.position.z > _current_checkpoint_z + checkpoint_offset) {
        if (current_checkpoint == 0) return;
        previousCheckpoint();
    }
    else if (event.deltaY < 0 && camera.position.z < _current_checkpoint_z - checkpoint_offset) {
        if (current_checkpoint == CHECKPOINTS.length - 1) return;
        nextCheckpoint();
    }
    else {
        camera.translateZ(event.deltaY > 0 ? zoom_speed : -zoom_speed);
    }
};

let transition_frames = 100;
let stop_transition = false;

function moveToCheckpoint(new_checkpoint) {
    console.log("Moving camera...")

    transitioning = true;

    let _frames = transition_frames; // * Math.abs(new_checkpoint - current_checkpoint);
    current_checkpoint = new_checkpoint;
    setZoomSpeed()
    setCheckpointOffset()
    setPanSpeed()

    let [target_position, target_rotation, target_focalLength] = CHECKPOINTS[new_checkpoint];
    let _alpha = 0;
    let _alphaDelta = 1 / _frames;

    // Needed because `slerp` wasn't functioning...
    let _target_rotation_vector4 = new THREE.Vector4(...target_rotation);
    let _current_camera_vector4 = new THREE.Vector4(...camera.quaternion);

    let tick = function() {
        if (stop_transition) return;

        let _eased_alpha = easeIn(_alpha, _frames);

        // Position
        camera.position.lerp(target_position, _alpha); 
        
        // Rotation
        // camera.quaternion.slerp(target_rotation, 1)
        _current_camera_vector4.lerp(_target_rotation_vector4, _alpha)
        camera.quaternion.set(..._current_camera_vector4);
        camera.quaternion.normalize();

        // Focal Length
        camera.setFocalLength(
            lerp(camera.getFocalLength(), target_focalLength * i_focalLength, _eased_alpha)
        );
    
        if (_alpha < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            _alpha += _alphaDelta;
        }
        else {
            transitioning = false;
            console.log("Finished transition")
        }
    };

    tick();
}

function nextCheckpoint() {
    console.log("Next checkpoint!")
    if (current_checkpoint + 1 == CHECKPOINTS.length) return
    moveToCheckpoint(current_checkpoint + 1);
}

function previousCheckpoint() {
    console.log("Previous checkpoint!")
    if (current_checkpoint == 0) return
    moveToCheckpoint(current_checkpoint - 1);
}

for (let i = 0; i < 3; i++) {
    document.getElementById("checkpoint_" + i.toString()).onclick = function() {
        if (i == current_checkpoint) return;
        if (transitioning) return;

        moveToCheckpoint(i);
    }
};


// LERP METHODS
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function easeIn(t)
{
    return t * t * t;
}
