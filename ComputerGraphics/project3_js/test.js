import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
/**
 * Lecture: Computer Graphics
 * Student Name: Baek Seung Rok
 * Student No. : 2015920023
 */ 

function main() {
    const canvas = {width:100, height:100}
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    const initialArmHeight = 2.0;
    const isWireFrameTrue = false;

    // room
    const room = {width:30, height:20};
    {
        const cubeGeo = new THREE.BoxBufferGeometry(room.width, room.height, room.width);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        cubeMat.side = THREE.BackSide;
        cubeGeo.receiveShadow = true;
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(0, room.height / 2, 0);
        room.receiveShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    // define the luxo lamp

    // base
    const base = new THREE.Object3D();
    {   
        scene.add(base);
    }
    
    // baseMesh 
    const baseMesh = {width:4, height:1, color:'red'};
    {
        baseMesh.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1),
                                    new THREE.MeshPhongMaterial({color: baseMesh.color, wireframe: isWireFrameTrue}));
        base.add(baseMesh.mesh);
    }
    
    // baseDisc
    const baseDisc = new THREE.Object3D();
    {
        baseDisc.angle = 128;
        base.add(baseDisc);
    }
    
    // baseDiscMesh
    const baseDiscMesh = {radius: 1, height: 0.2, color:'orange', segs:8};
    {
        baseDiscMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(baseDiscMesh.radius, 
                                    baseDiscMesh.radius, baseDiscMesh.height, baseDiscMesh.segs),
                                new THREE.MeshPhongMaterial({color: baseDiscMesh.color, wireframe: isWireFrameTrue}));
        baseDisc.add(baseDiscMesh.mesh);
    }

    // jointBase
    const jointBase = new THREE.Object3D();
    {
        jointBase.angle = -24;
        baseDisc.add(jointBase);
    }

    // jointBaseMesh
    const jointBaseMesh = {radius: 0.3, height: 1, color:'green', segs:4};
    {
        jointBaseMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(jointBaseMesh.radius, 
                                jointBaseMesh.radius, jointBaseMesh.height, jointBaseMesh.segs),
                                new THREE.MeshPhongMaterial({color: jointBaseMesh.color, wireframe: isWireFrameTrue}));
        jointBase.add(jointBaseMesh.mesh);
        jointBase.rotateZ(Math.PI * 0.5);
    }

    // lowerArm
    const lowerArm = new THREE.Object3D();
    {
        jointBase.add(lowerArm);
    }

    // lowerArmMesh
    const lowerArmMesh = {radius: 0.2, height: initialArmHeight, color:'blue', segs:4};
    {
        lowerArmMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(lowerArmMesh.radius, 
                                lowerArmMesh.radius, lowerArmMesh.height, lowerArmMesh.segs),
                                new THREE.MeshPhongMaterial({color: lowerArmMesh.color, wireframe: isWireFrameTrue}));
        lowerArm.add(lowerArmMesh.mesh);
        lowerArm.rotateZ(Math.PI * 0.5);
    }

    // jointMiddle
    const jointMiddle = new THREE.Object3D();
    {
        jointMiddle.angle = -83;
        lowerArm.add(jointMiddle);
    }

    // jointMiddleMesh
    const jointMiddleMesh = {radius: 0.3, height: 1, color:'green', segs:8};
    {
        jointMiddleMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(jointMiddleMesh.radius, 
                                jointMiddleMesh.radius, jointMiddleMesh.height, jointMiddleMesh.segs),
                                new THREE.MeshPhongMaterial({color: jointMiddleMesh.color, wireframe: isWireFrameTrue}));
        jointMiddle.add(jointMiddleMesh.mesh);
        jointMiddle.rotateZ(Math.PI * 0.5);
    }

    // upperArm
    const upperArm = new THREE.Object3D();
    {
        jointMiddle.add(upperArm);
    }

    // upperArmMesh
    const upperArmMesh = {radius: 0.2, height: initialArmHeight, color:'black', segs:4};
    {
        upperArmMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(upperArmMesh.radius, 
                                upperArmMesh.radius, upperArmMesh.height, upperArmMesh.segs),
                                new THREE.MeshPhongMaterial({color: upperArmMesh.color, wireframe: isWireFrameTrue}));
        upperArm.add(upperArmMesh.mesh);
        upperArm.rotateZ(-Math.PI * 0.5);
    }

    // jointHead
    const jointHead = new THREE.Object3D();
    {
        jointHead.angle = -91;
        upperArm.add(jointHead);
    }

    // jointHeadMesh
    const jointHeadMesh = {radius: 0.3, height: 1, color:'green', segs:8};
    {
        jointHeadMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(jointHeadMesh.radius, 
                                jointHeadMesh.radius, jointHeadMesh.height, jointHeadMesh.segs),
                                new THREE.MeshPhongMaterial({color: jointHeadMesh.color, wireframe: isWireFrameTrue}));
        jointHead.add(jointHeadMesh.mesh);
        jointHead.rotateZ(Math.PI * 0.5);
    }

    // lampCover
    const lampCover = new THREE.Object3D();
    {
        jointHead.add(lampCover);
    }

    // lampCoverMesh
    const lampCoverMesh = {radius: 2, height: 2, color:'#a3a3a3', segs:64};
    {
        lampCoverMesh.mesh = new THREE.Mesh( 
                                new THREE.CylinderBufferGeometry(lampCoverMesh.radius, 
                                lampCoverMesh.radius * 0.5, lampCoverMesh.height, lampCoverMesh.segs),
                                new THREE.MeshPhongMaterial({color: lampCoverMesh.color, wireframe: isWireFrameTrue}));
        lampCover.add(lampCoverMesh.mesh);
        lampCover.rotateZ(Math.PI * 0.5);
    }

    // blub
    const blub = new THREE.Object3D();
    {
        lampCover.add(blub);
    }

    // blubMesh
    const blubMesh = {radius: 0.5, color:'white'};
    {
        blubMesh.mesh = new THREE.Mesh( 
                                new THREE.SphereGeometry(blubMesh.radius),
                                new THREE.MeshPhongMaterial({color: blubMesh.color, wireframe: isWireFrameTrue}));
        blub.add(blubMesh.mesh);

    }

    // SpotLight
    {
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.castShadow = true;
        //spotLight.shadow.update(SpotLight);
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 0.5;
        spotLight.shadow.camera.far = 50; 

        spotLight.position.set(0,blubMesh.radius,0);
        blub.add(spotLight);

        var spotLightHelper = new THREE.SpotLightHelper( spotLight );
        spotLightHelper.visible = true;
        scene.add(spotLightHelper);
        spotLightHelper.update();

        var shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
        shadowCameraHelper.visible = false;
        scene.add(shadowCameraHelper);
    }

    var spotLightControls = new function() {
        this.angle = 45;
    }

    // Dummy Objects
    const sphere = new THREE.Object3D();
    {
        scene.add(sphere);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
    }
    const sphereMesh = {radius: 1, color: 'red'};
    {
        sphereMesh.mesh = new THREE.Mesh( 
                                new THREE.SphereGeometry(sphereMesh.radius),
                                new THREE.MeshPhongMaterial({color: sphereMesh.color, wireframe: false}));
        sphere.add(sphereMesh.mesh);
        sphereMesh.mesh.castShadow = true;
        sphereMesh.mesh.receiveShadow = true;
        sphere.position.set(10, 10, 0);
    }

    // Dummy Objects
    const sphere2 = new THREE.Object3D();
    {
        scene.add(sphere2);
        sphere2.castShadow = true;
        sphere2.receiveShadow = true;
    }
    const sphere2Mesh = {radius: 1, color: 'red'};
    {
        sphere2Mesh.mesh = new THREE.Mesh( 
                                new THREE.SphereGeometry(sphere2Mesh.radius),
                                new THREE.MeshPhongMaterial({color: sphere2Mesh.color, wireframe: false}));
        sphere2.add(sphere2Mesh.mesh);
        sphere2Mesh.mesh.castShadow = true;
        sphere2Mesh.mesh.receiveShadow = true;
        sphere2.position.set(3, 2, -3);
    }

    // Dummy Objects
    {
        var verticesOfCube = [
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
        ];

        var indicesOfFaces = [
            2,1,0,    0,3,2,
            0,4,7,    7,3,0,
            0,1,5,    5,4,0,
            1,2,6,    6,5,1,
            2,3,7,    7,6,2,
            4,5,6,    6,7,4
        ];

        const polyhedron = new THREE.Object3D();

        const polyhedronMesh = {color: '#b134eb'};
        polyhedronMesh.mesh = new THREE.Mesh(
            new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 2, 2 ),
            new THREE.MeshPhongMaterial({color: polyhedronMesh.color, wireframe: false})
        );
        polyhedron.add(polyhedronMesh.mesh);
        polyhedronMesh.mesh.castShadow = true;
        polyhedronMesh.mesh.receiveShadow = true;
        scene.add(polyhedron);
        polyhedron.position.set(10, 7.5, 7);
    }

    // Dummy Objects
    const dummyCube = new THREE.Object3D();
    {
        scene.add(dummyCube);
    }
    const dummyCubeMesh = {side: 1.5, color: '#ffaa00'};
    {
        dummyCubeMesh.mesh = new THREE.Mesh( 
                                new THREE.BoxGeometry( dummyCubeMesh.side, dummyCubeMesh.side, dummyCubeMesh.side ),
                                new THREE.MeshPhongMaterial({color: dummyCubeMesh.color, wireframe: false}));
        dummyCube.add(dummyCubeMesh.mesh);
        dummyCubeMesh.mesh.castShadow = true;
        dummyCubeMesh.mesh.receiveShadow = true;
        dummyCube.position.set(-10, 5, 0);
    }

    // Dummy Objects
    const dummyOctahedron = new THREE.Object3D();
    {
        scene.add(dummyOctahedron);
    }
    const dummyOctahedronMesh = {side: 1.5, color: '#fc039d'};
    {
        dummyOctahedronMesh.mesh = new THREE.Mesh( 
                                new THREE.OctahedronGeometry( dummyOctahedronMesh.side ),
                                new THREE.MeshPhongMaterial({color: dummyOctahedronMesh.color, wireframe: false}));
        dummyOctahedron.add(dummyOctahedronMesh.mesh);
        dummyOctahedronMesh.mesh.castShadow = true;
        dummyOctahedronMesh.mesh.receiveShadow = true;
        dummyOctahedron.position.set(-7, 8, 10);
    }
    
    // Dummy Objects
    const dummyTorus = new THREE.Object3D();
    const dummyTorusMesh = {radius: 2, tube: 0.4, color: '#ffff00'}
    {
        scene.add(dummyTorus);
        dummyTorusMesh.mesh = new THREE.Mesh(
            new THREE.TorusGeometry( 2, 0.4, 16, 100 ),
            new THREE.MeshPhongMaterial({color: dummyTorusMesh.color, wireframe: false})
        )
        dummyTorus.add(dummyTorusMesh.mesh);
        dummyTorusMesh.mesh.castShadow = true;
        dummyTorusMesh.mesh.receiveShadow = true;
        dummyTorus.position.set(-5, 4, -7);
    }
    
    // Dummy Objects
    const dummyTorusKnot = new THREE.Object3D();
    const dummyTorusKnotMesh = {radius: 2, tube: 0.4, color: '#4fff30'}
    {
        scene.add(dummyTorusKnot);
        dummyTorusKnotMesh.mesh = new THREE.Mesh(
            new THREE.TorusKnotGeometry( 2, 0.5, 100, 16,  ),
            new THREE.MeshPhongMaterial({color: dummyTorusKnotMesh.color, wireframe: false})
        )
        dummyTorusKnot.add(dummyTorusKnotMesh.mesh);
        dummyTorusKnotMesh.mesh.castShadow = true;
        dummyTorusKnotMesh.mesh.receiveShadow = true;
        dummyTorusKnot.position.set(2, 7, -7);
    }
 
    function updateLuxo() {
        base.position.y = baseMesh.height/2;
        baseMesh.mesh.scale.set(baseMesh.width, baseMesh.height, baseMesh.width);

        baseDisc.position.y = baseMesh.height/2;
        baseDisc.rotation.y = THREE.MathUtils.degToRad(baseDisc.angle);
        baseDiscMesh.mesh.position.y = baseDiscMesh.height/2;

        jointBase.position.y = baseDiscMesh.height/2;
        jointMiddle.position.y = -((initialArmHeight * lowerArmMesh.height) / 2);
        jointHead.position.y = -((initialArmHeight * upperArmMesh.height) / 2);
        
        lowerArm.position.x = (initialArmHeight * lowerArmMesh.height) / 2;
        lowerArmMesh.mesh.scale.set(1, lowerArmMesh.height, 1);

        upperArm.position.x = -(initialArmHeight * upperArmMesh.height) / 2;
        upperArmMesh.mesh.scale.set(1, upperArmMesh.height, 1);

        jointBase.rotation.x = THREE.MathUtils.degToRad(jointBase.angle);
        jointMiddle.rotation.x = THREE.MathUtils.degToRad(jointMiddle.angle);
        jointHead.rotation.x = THREE.MathUtils.degToRad(jointHead.angle);

        lampCover.position.x = -lampCoverMesh.height / 2;
        blub.position.y = lampCoverMesh.height / 2;

        spotLight.position.set(0,-blubMesh.radius,0);
        spotLight.angle = spotLightControls.angle / 100;
        spotLight.target = blub;
        
    }

    updateLuxo();

    {
        const gui = new GUI();
        let folder;
        folder = gui.addFolder('base (red box)');
        folder.add(base.position, 'x', -room.width/2, room.width/2, 1).name('x').onChange(updateLuxo);
        folder.add(base.position, 'z', -room.width/2, room.width/2, 1).name('z').onChange(updateLuxo);
        folder.add(baseMesh, 'height', 0.1, 2, 0.1).name('height').onChange(updateLuxo);
        folder.open();

        gui.add(baseDisc, 'angle', 0, 360, 1).name('angle (yellow)').onChange(updateLuxo);
        
        let folder_arm_length;
        folder_arm_length = gui.addFolder('arm (blue) lengths');
        folder_arm_length.add(lowerArmMesh, 'height', 2, 7, 0.1).name('lower').onChange(updateLuxo);
        folder_arm_length.add(upperArmMesh, 'height', 2, 7, 0.1).name('upper').onChange(updateLuxo);
        folder_arm_length.open();

        let joint_angles;
        joint_angles = gui.addFolder('joint (green) angles');
        joint_angles.add(jointBase, 'angle', -180, 180, 1).name('base').onChange(updateLuxo);
        joint_angles.add(jointMiddle, 'angle', -180, 180, 1).name('middle').onChange(updateLuxo);
        joint_angles.add(jointHead, 'angle', -180, 180, 1).name('head').onChange(updateLuxo);
        joint_angles.open();

        let light_blub;
        light_blub = gui.addFolder('light bulb');
        light_blub.add(spotLightControls, 'angle', 10, 90, 1).name('light angle').onChange(updateLuxo);
        light_blub.add(spotLightHelper, 'visible').name('show helper').onChange(updateLuxo);
        light_blub.open();
    }


    {   // point light
        const color = 0xFFFFFF;
        const intensity = 0.5;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(0, room.height, 0);
        scene.add(light);
        
        const helper = new THREE.PointLightHelper(light);
        scene.add(helper);
    }
    {   // an ambient light
        const light = new THREE.AmbientLight('white', 0.3);
        scene.add(light);
    }


    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, room.height*0.5, room.width*1.4);
    
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, room.height*0.5, 0);
    controls.update();
 
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }
    
    function render() {
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        
        spotLightHelper.update();
        shadowCameraHelper.update();
        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
}

main();