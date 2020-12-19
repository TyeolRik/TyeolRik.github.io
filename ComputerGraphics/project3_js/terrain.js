// Reference
// https://www.lukaszielinski.de/blog/posts/2014/11/07/webgl-creating-a-landscape-mesh-with-three-dot-js-using-a-png-heightmap/
import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from "https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/FBXLoader.js";
import { Sky } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/objects/Sky.js';
// import { GUI } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/libs/dat.gui.module.js';

// Global Variable
var heading = [0, -1, 0];
var chopper;
var __terrain;
var left_or_right = false;      // left = false, right = true;
var explosions = [];
var directionalLight;

var bulletCount = 0;
var reloadCooldown = null;

// Setting Terrain
// Make the img global so we can easily access the width and height.
var img;
var image_scale_percentage = 0.5;

// How much to scale the height of the heightfield.
var height_scale = 15;

function addLights() {
    var ambientLight = new THREE.AmbientLight(0x444444);
    ambientLight.intensity = 0.3;
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff);

    directionalLight.position.set(440, -500, 500);
    directionalLight.castShadow = true;

    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 35;
    directionalLight.shadow.camera.bottom = -30;
    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 5120; // default
    directionalLight.shadow.mapSize.height = 5120; // default
    directionalLight.shadow.camera.near = 0; // default
    directionalLight.shadow.camera.far = 5000; // default

    scene.add(directionalLight);
    scene.add(directionalLight.target);
}

function setupCamera() {
    camera.up.set( 0, 0, 30 );
    camera.position.x = 4.4;
    camera.position.y = -5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//To get the pixels, draw the image onto a canvas. From the canvas get the Pixel (R,G,B,A)
function getTerrainPixelData() {
    img = document.getElementById("landscape-image");
    var canvas = document.getElementById("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width * image_scale_percentage, img.height * image_scale_percentage);

    var data = canvas.getContext('2d').getImageData(0, 0, img.width * image_scale_percentage, img.height * image_scale_percentage).data;
    var normPixels = []

    for (var i = 0, n = data.length; i < n; i += 4) {
        // get the average value of R, G and B.
        normPixels.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }

    return normPixels;
}

function addGround() {
    var terrain = getTerrainPixelData();

    console.log("Image width: ", img.width, "\theight: ", img.height)
    var geometry = new THREE.PlaneGeometry(70, 70, img.width * image_scale_percentage - 1, img.height * image_scale_percentage - 1);
    var material = new THREE.MeshLambertMaterial({
        color: 0xccccff,
        wireframe: false
    });

    // keep in mind, that the plane has more vertices than segments. If there's one segment, there's two vertices, if
    // there's 10 segments, there's 11 vertices, and so forth. 
    // The simplest is, if like here you have 100 segments, the image to have 101 pixels. You don't have to worry about
    // "skewing the landscape" then..

    // to check uncomment the next line, numbers should be equal
    //console.log("length: " + terrain.length + ", vertices length: " + geometry.vertices.length);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        var terrainValue = terrain[i] / 255;
        geometry.vertices[i].z = geometry.vertices[i].z + terrainValue * height_scale;
    }
    // might as well free up the input data at this point, or I should say let garbage collection know we're done.
    terrain = null;

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    __terrain = new THREE.Mesh(geometry, material);
    __terrain.receiveShadow = true;

    __terrain.position.set(0, 0, -20);
    // rotate the plane so up is where y is growing..

    scene.add(__terrain);
}

const savedAngle = Math.PI / 180 * -35;
const x_degree = Math.PI / 180 * 20;

const tempVector = new THREE.Vector3(0, 1, 0);


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //console.log(camera.position);
    
    rotorHead.rotateOnAxis(tempVector, x_degree);
    
    bulletTracking();
    explosionAnimator();
    directionalLight.target.updateMatrixWorld();
}

// Sky
var sky = new Sky();
var sun = new THREE.Vector3();
const uniforms = sky.material.uniforms;
uniforms[ "up" ].value = new THREE.Vector3(0, 0, 1);
uniforms[ "turbidity" ].value = 9;
uniforms[ "rayleigh" ].value = 4;
uniforms[ "mieCoefficient" ].value = 0.1;
uniforms[ "mieDirectionalG" ].value = 0.999999;

const theta = Math.PI * ( 0.5832 - 0.5 );
const phi = 2 * Math.PI * ( 1 - 0.5 );

sun.x = Math.cos( phi );
sun.y = Math.sin( phi ) * Math.sin( theta );
sun.z = Math.sin( phi ) * Math.cos( theta );

uniforms[ "sunPosition" ].value.copy( new THREE.Vector3(4.4, -5, 5) );

sky.scale.setScalar( 450000 );
var scene = new THREE.Scene();
console.log(sky);
scene.add(sky);
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMappingExposure = 0.5832;
renderer.shadowMap.enabled = true;
renderer.domElement.id = "GameVision";

var bullets = [];

const clock = new THREE.Clock();

var chopper;        // Apache AH-64
var rotor;          // AH-64 rotor

setupCamera();
addLights();
addGround();

renderer.setSize(window.innerHeight, window.innerHeight);
var GameVision = document.getElementById("GameVision");
GameVision.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// Chopper
var rotorHead;
const loader = new FBXLoader();
loader.load( './project3_assets/ah-64-fbx-without-rotor/ah-64-no-rotor.fbx', function ( object ) {
    object.scale.set( 0.2, 0.2, 0.2 );
    object.position.set(0, 0, 0);

    const geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0x5c5c5c} );
    rotorHead = new THREE.Mesh( geometry, material );
    rotorHead.position.set(0, 3, 3);
    const blade1 = new THREE.Mesh(new THREE.BoxGeometry( 0.4, 0.1, 4 ), new THREE.MeshBasicMaterial({color: 0x5c5c5c}));
    const blade2 = new THREE.Mesh(new THREE.BoxGeometry( 0.4, 0.1, 4 ), new THREE.MeshBasicMaterial({color: 0x5c5c5c}));
    blade1.position.set(0, 0, 2);
    blade2.position.set(0, 0, -2);
    rotorHead.add(blade1);
    rotorHead.add(blade2);
    object.add(rotorHead);

    object.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    object.castShadow = true;
    object.receiveShadow = true;
    chopper = object;
    console.log(new THREE.Box3().setFromObject( object ));
    
    object.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 180 * 125);
    scene.add( object );
} );

// User Input Setting
document.onkeydown = keydown; 
function keydown (evt) { 
    if (!evt) evt = event; 
    // console.log(evt.keyCode);

    if(evt.shiftKey && evt.keyCode == 37) {  // Rotate the view Around the z-axis    LEFT
        camera.position.applyQuaternion( new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3( 0, 0, 1 ), // The positive z-axis
            Math.PI / 180 * 10 // The amount of rotation to apply this time
        ));
        camera.lookAt( 0,0,0 );
        toggle_color("RotateLeft1");
        toggle_color("RotateLeft2");
    }
    if(!evt.shiftKey && evt.keyCode == 37) {
        chopper.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 180 * -35);
        chopper.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        chopper.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 180 * 35);
        if(heading[0] == 0 && heading[1] == -1) {
            heading[0] = 1;
            heading[1] = 0;
        } else if(heading[0] == 1 && heading[1] == 0) {
            heading[0] = 0;
            heading[1] = 1;
        } else if (heading[0] == 0 && heading[1] == 1) {
            heading[0] = -1;
            heading[1] = 0;
        } else {
            heading[0] = 0;
            heading[1] = -1;
        }
        toggle_color("chopperLeft");
    }
    if(evt.shiftKey && evt.keyCode == 39) {  // Rotate the view Around the z-axis    RIGHT
        camera.position.applyQuaternion( new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3( 0, 0, -1 ), // The negative z-axis
            Math.PI / 180 * 10 // The amount of rotation to apply this time
        ));
        camera.lookAt( 0,0,0 );
        toggle_color("RotateRight1");
        toggle_color("RotateRight2");
    }
    if(!evt.shiftKey && evt.keyCode == 39) {
        chopper.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 180 * -35);
        chopper.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / -2);
        chopper.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI / 180 * 35);
        if(heading[0] == 0 && heading[1] == -1) {
            heading[0] = -1;
            heading[1] = 0;
        } else if(heading[0] == 1 && heading[1] == 0) {
            heading[0] = 0;
            heading[1] = -1;
        } else if (heading[0] == 0 && heading[1] == 1) {
            heading[0] = 1;
            heading[1] = 0;
        } else {
            heading[0] = 0;
            heading[1] = 1;
        }
        toggle_color("chopperRight");
    }
    if(evt.shiftKey && evt.keyCode == 38) {  // Tilt UP the whole world
        camera.position.z += 1;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        toggle_color("TiltUp1");
        toggle_color("TiltUp2");
    }
    if(!evt.shiftKey && evt.keyCode == 38) {       // Arrow UP : Move Forward
        chopper.position.x += heading[0];
        chopper.position.y += heading[1];
        toggle_color("chopperForward");
    }
    if(evt.shiftKey && evt.keyCode == 40) {  // Tilt Down the whole world
        camera.position.z -= 1;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        toggle_color("TiltDown1");
        toggle_color("TiltDown2");
    }
    if(!evt.shiftKey && evt.keyCode == 40) {        // Arrow Down
        chopper.position.x -= heading[0];
        chopper.position.y -= heading[1];
        toggle_color("chopperBackward");
    }
    if(evt.keyCode == 107) {  // Zoom in
        camera.position.x *= 0.8;
        camera.position.y *= 0.8;
        camera.position.z *= 0.8;
        toggle_color("ZoomIN1");
        toggle_color("ZoomIN2");
    }
    if(evt.keyCode == 187) {  // Zoom in
        camera.position.x *= 0.8;
        camera.position.y *= 0.8;
        camera.position.z *= 0.8;
        toggle_color("ZoomIN1");
        toggle_color("ZoomIN2");
    }
    if(evt.keyCode == 109) {  // Zoom out
        camera.position.x *= 1.2;
        camera.position.y *= 1.2;
        camera.position.z *= 1.2;
        toggle_color("ZoomOUT1");
        toggle_color("ZoomOUT2");
    }
    if(evt.keyCode == 189) {  // Zoom out
        camera.position.x *= 1.2;
        camera.position.y *= 1.2;
        camera.position.z *= 1.2;
        toggle_color("ZoomOUT1");
        toggle_color("ZoomOUT2");
    }
    if(evt.keyCode == 32) {     // Shooting Bullet
        toggle_color("chopperShoot");
        shoot();
    }
}

const onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
};
const onError = function () { };

const preRenderedbulletPointLight = new THREE.PointLight( 0xffff00, 1, 10 );
const preRenderedExplosionPointLight = new THREE.PointLight ( 0xFF0000, 5, 100 );

function shoot() {
    if(reloadCooldown == null) {
        canSHOOT();
    } else if(reloadCooldown.getElapsedTime() <= 5) {
        // Cannot Shoot!
        toggle_color_TO_RED("ammo")
    } else {
        canSHOOT();
    }
}

function canSHOOT() {
    // Can shoot
    document.getElementById("ammoLeft").textContent = (8 - bulletCount) + " / 8";

    new OBJLoader()
        .setPath('./project3_assets/MissileAGM-65/Files/')
        .load('Missile-AGM-65.obj', function (object) {
            bullets.push(object);
            bulletCount++;
            console.log(object.position);
            if (heading[0] == 0 && heading[1] == -1) {
                object.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), Math.PI / 2);
                if (left_or_right) {
                    object.position.set(chopper.position.x + heading[0] + 0.5, chopper.position.y + heading[1], chopper.position.z - 0.7);
                } else {
                    object.position.set(chopper.position.x + heading[0] - 0.5, chopper.position.y + heading[1], chopper.position.z - 0.7);
                }
            } else if (heading[0] == 1 && heading[1] == 0) {
                object.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), Math.PI);
                if (left_or_right) {
                    object.position.set(chopper.position.x + heading[0], chopper.position.y + heading[1] - 0.5, chopper.position.z - 0.7);
                } else {
                    object.position.set(chopper.position.x + heading[0], chopper.position.y + heading[1] + 0.5, chopper.position.z - 0.7);
                }
            } else if (heading[0] == 0 && heading[1] == 1) {
                object.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), Math.PI / 2 * 3);
                if (left_or_right) {
                    object.position.set(chopper.position.x + heading[0] - 0.5, chopper.position.y + heading[1], chopper.position.z - 0.7);
                } else {
                    object.position.set(chopper.position.x + heading[0] + 0.5, chopper.position.y + heading[1], chopper.position.z - 0.7);
                }
            } else {
                if (left_or_right) {
                    object.position.set(chopper.position.x + heading[0], chopper.position.y + heading[1] + 0.5, chopper.position.z - 0.7);
                } else {
                    object.position.set(chopper.position.x + heading[0], chopper.position.y + heading[1] - 0.5, chopper.position.z - 0.7);
                }
            }
            left_or_right = !left_or_right;

            const bulletPointLight = preRenderedbulletPointLight.clone();
            bulletPointLight.position.set(object.position.x, object.position.y, object.position.z);
            object.add(bulletPointLight);

            object.castShadow = true;
            object.receiveShadow = true;
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            object.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), Math.PI / 180 * -40);       // 기울이기
            object.scale.set(0.02, 0.02, 0.02);
            object.userData.shootingTime = new THREE.Clock();
            object.userData.bulletVector = [heading[0], heading[1], heading[2]];
            object.userData.nowAngle = Math.PI / 180 * 40;
            object.userData.left_or_right = false;
            object.userData.isHitted = false;
            scene.add(object);
            
            if (bulletCount % 8 == 0 && bulletCount != 0) {
                toggle_AMMO();
                document.getElementById("ammoLeft").textContent = "0 / 8";
                reloadCooldown = new THREE.Clock();
                bulletCount = 0;
            } else {
                document.getElementById("ammoLeft").textContent = (8 - bulletCount) + " / 8";
            }
        }, onProgress, onError);
}

function bulletTracking() {
    const g = 0.98;
    const vx = 0.5;
    const vy = vx * Math.tan(Math.PI / 180 * 35);        // Chopper Angle
    bullets.forEach(function(item, index, object) {
        if (item.position.z >= -20) {
            var elapsedTime = item.userData.shootingTime.getElapsedTime() * 2;
            var deltaX = item.userData.bulletVector[0] * vx * elapsedTime;
            var deltaY = item.userData.bulletVector[1] * vx * elapsedTime;
            var deltaZ = (-1/2) * (g + vy) * elapsedTime * elapsedTime;
            item.position.x += deltaX;
            item.position.y += deltaY;
            item.position.z += deltaZ;

            // Bullet Leaning
            if(deltaZ != 0) {
                let nextAngle = Math.atan(Math.abs(deltaX * item.userData.bulletVector[0] + deltaY * item.userData.bulletVector[1]) / Math.abs(deltaZ));
                item.rotateOnAxis(new THREE.Vector3(0, -1, 0).normalize(), (nextAngle - item.userData.nowAngle) * -1);
                item.userData.nowAngle = nextAngle;
            }

            const raycaster = new THREE.Raycaster(item.position.clone(), new THREE.Vector3(item.userData.bulletVector[0] * vx, item.userData.bulletVector[1] * vx, (-1/2) * (g + vy) * elapsedTime));
            const intersects = raycaster.intersectObject( __terrain );
            // Toggle rotation bool for meshes that we clicked
			if ( intersects.length > 0 ) {
                if(intersects[0].distance < 2) {
                    if(item.userData.isHitted == false) {
                        console.log("HIT!");
                        explosion(item.position.x, item.position.y, item.position.z, index);
                        while (item.children.length) {
                            item.remove(item.children[0]);
                        }
                        object.splice(index, 1);
                    }
                    item.userData.isHitted = true;
                }
                //console.log(intersects[0]);
			}
        }
        if (item.position.z < -20) {
            object.splice(index, 1);
        }
    });
}

function explosion(siteX, siteY, siteZ, index) {
    const geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = siteX;
    sphere.position.y = siteY;
    sphere.position.z = siteZ;
    sphere.userData.explosionEnd = false;

    scene.add( sphere );
    explosions.push(sphere);
}

function explosionAnimator() {
    explosions.forEach(function(item, index, object) {
        if(item.scale.x < 15 && item.userData.explosionEnd == false) {
            item.scale.x += 0.3;
            item.scale.y += 0.3;
            item.scale.z += 0.3;
        } else {
            item.userData.explosionEnd = true;
        }
        if(item.userData.explosionEnd) {
            item.scale.x -= 0.3;
            item.scale.y -= 0.3;
            item.scale.z -= 0.3;
        }
        if(item.userData.explosionEnd == true && item.scale.x < 0.5) {
            object.splice(index, 1);
            scene.remove(item);
        }
    });
}

const effectController = {
    turbidity: 13,
    rayleigh: 4,
    mieCoefficient: 0.023,
    mieDirectionalG: 0.529,
    inclination: 0.5182, // elevation / inclination
    azimuth: 0.502, // Facing front,
    exposure: 0.5724
};

function toggle_color(id) {
    document.getElementById(id).style.backgroundColor = `#FFFFFF`;
    setTimeout(() => document.getElementById(id).style.backgroundColor = `#D3D3D3`, 500);
}

function toggle_color_TO_RED(id) {
    document.getElementById(id).style.color = `#FF0000`;
    setTimeout(() => document.getElementById(id).style.color = `#000`, 500);
}

function toggle_AMMO() {
    document.getElementById("ammo").textContent = "RELOAD";
    setTimeout(function() {
        document.getElementById("ammo").textContent = "AMMO"
        document.getElementById("ammoLeft").textContent = "8 / 8";
    }, 5000);
}

/*
function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;

    const theta = Math.PI * ( effectController.inclination - 0.5 );
    const phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

    sun.x = Math.cos( phi );
    sun.y = Math.sin( phi ) * Math.sin( theta );
    sun.z = Math.sin( phi ) * Math.cos( theta );

    uniforms[ "sunPosition" ].value.copy( new THREE.Vector3(4.4, -5, 5) );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

}

const gui = new GUI();

gui.add( effectController, "turbidity", 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
gui.add( effectController, "exposure", 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();
*/
render();
