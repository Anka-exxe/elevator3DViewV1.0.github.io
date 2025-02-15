import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { FBXLoader } from "jsm/loaders/FBXLoader.js";
import * as elements from './constants.js';
import { Reflector } from 'jsm/objects/Reflector.js';


let scene, camera, renderer, controls, elevatorModel;

init();

function init() {
    scene = new THREE.Scene();

    const liftContainer = document.getElementById('lift-container');
    const width = liftContainer.clientWidth;
    const height = liftContainer.clientHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
   //camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    liftContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    const loader = new FBXLoader();

    loader.load('./newModel.fbx', (fbx) => {
        console.log(fbx.scene); // Вывод всей структуры модели в консоль
    });

    loader.load('./newModel.fbx', (object) => {
        elevatorModel = object;

        elevatorModel.traverse((child) => {
            if (child.isMesh) {
                console.log(`Object: ${child.name}, Material: ${child.material.type}`);
            }
        });
        
        viewOutside();


        elevatorModel.getObjectByName('LeftDoor1').visible = false;
        elevatorModel.getObjectByName('RightDoor1').visible = false;
        //elevatorModel.getObjectByName('BackWall11').visible = false;
        elevatorModel.getObjectByName('BackWall12').visible = false;
        elevatorModel.getObjectByName('BackWall13').visible = false;
        elevatorModel.getObjectByName('BackWall14').visible = false;
        elevatorModel.getObjectByName('Line660').visible = false;
        elevatorModel.getObjectByName('Line663').visible = false;
        elevatorModel.getObjectByName('Threshold1').visible = false;
        elevatorModel.getObjectByName('RightHandrail11').visible = false;
        elevatorModel.getObjectByName('RightHandrail12').visible = false;
        elevatorModel.getObjectByName('RightHandrail13').visible = false;
        elevatorModel.getObjectByName('RightHandrail14').visible = false;
        elevatorModel.getObjectByName('RightHandrail15').visible = false;
        elevatorModel.getObjectByName('RightHandrail16').visible = false;
        elevatorModel.getObjectByName('RightHandrail17').visible = false;
        elevatorModel.getObjectByName('RightHandrail18').visible = false;
        elevatorModel.getObjectByName('BackHandrail11').visible = false;
        elevatorModel.getObjectByName('BackHandrail12').visible = false;
        elevatorModel.getObjectByName('BackHandrail13').visible = false;
        elevatorModel.getObjectByName('BackWall1').visible = false;

        loadTextureForObject(elements.elements.ControlPanel, './DL89E_glossiness.jpg');
        loadTextureForObject(elements.elements.Lamp, './P01.jpg');
        loadTextureForObject(elements.elements.Ceiling, './DL89E_glossiness.jpg');
        loadTextureForObject(elements.elements.FrontWall, './DL89E_diffuse.jpg');
        loadTextureForObject(elements.elements.BackWall, './DL89E_diffuse.jpg');
        loadTextureForObject(elements.elements.LeftWall, './DL89E_diffuse.jpg');
        loadTextureForObject(elements.elements.RightWall, './DL89E_diffuse.jpg');
        loadTextureForObject(elements.elements.Door, './DL89E_glossiness.jpg');
        loadTextureForObject(elements.Floor, './nero marquina.jpg');
        loadTextureForObject(elements.elements.Bumper, './nero marquina.jpg');
        loadTextureForObject(elements.Mirror, './зеркало.jpg');
        loadTextureForObject(elements.Threshold, './nero marquina.jpg');
        loadTextureForObject(elements.BackHandrail, './хромированная сталь.jpg');
        loadTextureForObject(elements.elements.RightHandrail, './хромированная сталь.jpg');
        loadTextureForObject(elements.DisplayVertical, './хромированная сталь.jpg');
        loadTextureForObject('BackWall11', './хромированная сталь.jpg');
        //createMirrorForObject('Mirror');


        const box = new THREE.Box3().setFromObject(elevatorModel);
        const center = box.getCenter(new THREE.Vector3());
        elevatorModel.position.sub(center);
        scene.add(elevatorModel);
    }, undefined, (error) => {
        console.error('Error loading FBX model:', error);
    });

    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

//viewInside();
//viewOutside();

function viewInside(){
    camera.position.set(0, 2, 5);

    //controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxDistance = 30;
    controls.minDistance = 2;
    controls.target.set(100, 100, 100);

    animate();
}

function viewOutside() {
    camera.position.set(-200, 0, 200);

    //controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxDistance = 400;
    controls.minDistance = 2;
    controls.target.set(0, 0, 0);
        
    Animate3D();
}

function viewFront(){
    camera.position.set(10, 10, 10);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxDistance = 100;
    controls.minDistance = -2;
    controls.target.set(-100, 0, 100);

    const backWall = elevatorModel.getObjectByName(elements.backWall);
    backWall.visible = false;

    animate();
}

function onWindowResize() {
    const liftContainer = document.getElementById('lift-container');
    const width = liftContainer.clientWidth;
    const height = liftContainer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function createMirrorForObject(objectName) {
    const object = elevatorModel.getObjectByName(objectName);

    if (object) {
        // Создаём геометрию зеркала, основываясь на размере оригинального объекта
        const mirrorGeometry = object.geometry.clone();

        // Создаём зеркальную поверхность
        const mirror = new Reflector(mirrorGeometry, {
            clipBias: 0.003, // Сглаживание отражения
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x889999, // Базовый цвет (серебристый)
        });

        // Устанавливаем позицию и ориентацию зеркала
        mirror.position.copy(object.position);
        mirror.rotation.copy(object.rotation);

        // Заменяем оригинальный объект на зеркало
        object.parent.add(mirror);
        object.visible = false; // Скрываем оригинальный объект
    } else {
        console.warn(`${objectName} not found in the model`);
    }
}

/*export function loadTextureForObject(objectName, texturePath){
    const obj = elevatorModel.getObjectByName(objectName);
    if (obj) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturePath, (texture) => {
            // Настройка повторения текстуры, если необходимо
            texture.wrapS = THREE.RepeatWrapping;  // Повторение по оси X
            texture.wrapT = THREE.RepeatWrapping;  // Повторение по оси Y
            texture.repeat.set(1, 1);  // Например, повторение текстуры 4 раза по обеим осям

            // Создание материала с текстурой
            const newMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });

            // Применяем новый материал к объекту
            applyNewMaterial(obj, newMaterial);
        }, undefined, (error) => {
            console.error(`Error loading texture for ${objectName}:`, error);
        });
    } else {
        console.warn(`${objectName} not found in the model`);
    }
}*/

export function loadTextureForObject(objectNames, texturePath) {
    // Если передан массив имен объектов
    if (Array.isArray(objectNames)) {
        objectNames.forEach((objectName) => {
            applyTextureToSingleObject(objectName, texturePath);
        });
    } else {
        // Если передано одно имя объекта
        applyTextureToSingleObject(objectNames, texturePath);
    }
}

// Функция для применения текстуры к одному объекту
function applyTextureToSingleObject(objectName, texturePath) {
    const obj = elevatorModel.getObjectByName(objectName);
    if (obj) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturePath, (texture) => {
            // Настройка повторения текстуры, если нужно
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1); // Настройка повторений текстуры

            // Создаем новый материал с текстурой
            const newMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });

            // Применяем новый материал к объекту
            applyNewMaterial(obj, newMaterial);
        }, undefined, (error) => {
            console.error(`Error loading texture for ${objectName}:`, error);
        });
    } else {
        console.warn(`${objectName} not found in the model`);
    }
}

function applyNewMaterial(obj, newMaterial) {
    obj.material = newMaterial;
    obj.material.needsUpdate = true;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function Animate3D() {
    requestAnimationFrame(Animate3D);
    controls.update();

    const angle = controls.getAzimuthalAngle();

    //setVisibility(angle);

    console.log(angle * 180 / Math.PI);
    
    renderer.render(scene, camera);
}


function setVisibility(angle) {
    const leftwall = elevatorModel.getObjectByName(elements.leftWall);
    leftwall.visible = !(angle > -7 * Math.PI / 18 && angle < 7 * Math.PI / 18);
    const scoreboard = elevatorModel.getObjectByName(elements.scoreboard);
    scoreboard.visible = !(angle > -7 * Math.PI / 18 && angle < 7 * Math.PI / 18);
    const preScoreBoard = elevatorModel.getObjectByName(elements.preScoreBoard);
    preScoreBoard.visible = !(angle > -7 * Math.PI / 18 && angle < 7 * Math.PI / 18);

    const rightWall = elevatorModel.getObjectByName(elements.rightWall);
    rightWall.visible = !((angle < -11 * Math.PI / 18 && angle > -Math.PI) ||
    (angle > 11 * Math.PI / 18 && angle < Math.PI));
    const rightWallHandrail = elevatorModel.getObjectByName(elements.rightWallHandrail);
    rightWallHandrail.visible = !((angle < -11 * Math.PI / 18 && angle > -Math.PI) ||
    (angle > 11 * Math.PI / 18 && angle < Math.PI));

    const frontWall = elevatorModel.getObjectByName(elements.frontWall);
    frontWall.visible = !(angle < - Math.PI / 18 && angle > -17 * Math.PI / 18);
    const frontMetalicWall = elevatorModel.getObjectByName(elements.frontMetalicWall);
    frontMetalicWall.visible = !(angle < - Math.PI / 18 && angle > -17 * Math.PI / 18);
    const frontWallHandrail = elevatorModel.getObjectByName(elements.frontWallHandrail);
    frontWallHandrail.visible = !(angle < - Math.PI / 18 && angle > -17 * Math.PI / 18);

    const backWall = elevatorModel.getObjectByName(elements.backWall);
    backWall.visible = !(angle > Math.PI / 18 && angle < 17 * Math.PI / 18);
   const door = elevatorModel.getObjectByName(elements.door);
   door.visible = !(angle > Math.PI / 18 && angle < 17 * Math.PI / 18);
}

function setVisibile2(cameraDirection) {

const leftNormal = new THREE.Vector3(-1, 0, 0); // Нормаль для левой стенки
const rightNormal = new THREE.Vector3(1, 0, 0);

// Вычисляем скалярное произведение между нормалью и направлением на камеру
const leftDotProduct = leftNormal.dot(cameraDirection);

console.log(leftDotProduct);

// Устанавливаем порог для видимости (например, -0.1 для некоторой гибкости)
const visibilityThreshold = -0.1;

    const leftwall = elevatorModel.getObjectByName(elements.leftWall);
    leftwall.visible = leftDotProduct < visibilityThreshold;

    /*const rightWall = elevatorModel.getObjectByName(elements.rightWall);
    rightWall.visible = angle > Math.PI / 4;

    const frontWall = elevatorModel.getObjectByName(elements.frontWall);
    frontWall.visible = angle > Math.PI / 4;

    const backWall = elevatorModel.getObjectByName(elements.backWall);
    backWall.visible = angle > Math.PI / 4;*/
}