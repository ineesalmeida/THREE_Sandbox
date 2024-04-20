import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Set background
// scene.background = new THREE.Color( 0x26547C );

const _geo_back = new THREE.BoxGeometry( 2, 0.01, 2 );
const _geo_floor = new THREE.BoxGeometry( 2, 2, 0.01 );
const material = new THREE.MeshBasicMaterial( { color: 0x26547C } );
const _back = new THREE.Mesh( _geo_back, material );
const _floor = new THREE.Mesh( _geo_floor, material );
scene.add( _back );
scene.add( _floor );


// Add lights
const light1 = new THREE.PointLight(0xABC8C7, 50)
const light2 = new THREE.PointLight(0xFFD166, 40)
light1.position.set(0.8, 1.4, 1.0)
light2.position.set(-0.8, -1.4, 1.0)
scene.add(light1)
scene.add(light2)

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

// Start renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

// Add CanGuru model
const fbxLoader = new FBXLoader()
fbxLoader.load(
    "public/models/Bomb.fbx",
    // "public/models/CanGuru.fbx",
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

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
    controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
