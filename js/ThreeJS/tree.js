import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { FBXLoader } from "jsm/loaders/FBXLoader.js";

let scene, camera, renderer, controls, elevatorModel;

init();

function init() {
    scene = new THREE.Scene();

    // Установка камеры
    const liftContainer = document.getElementById('lift-container');
    const width = liftContainer.clientWidth;
    const height = liftContainer.clientHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Создание WebGL рендерера
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    liftContainer.appendChild(renderer.domElement); // Добавляем рендерер в контейнер

    // Добавление освещения
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Загрузка FBX модели
    const loader = new FBXLoader();
    loader.load('./TestLift.fbx', (object) => {
        elevatorModel = object;

        // Логирование всех детей для поиска правильных имен
        elevatorModel.traverse((child) => {
            if (child.isMesh) {
                console.log(`Object: ${child.name}, Material: ${child.material.type}`);
            }
        });

         // Загружаем текстуры для объектов
        loadTextureForObject('HandRail2', './хромированная сталь.jpg');
        loadTextureForObject('HandRail1', './хромированная сталь.jpg');

         // Примените другие текстуры для других частей модели
        loadTextureForObject('LeftWall', './DL89E_diffuse.jpg');
        loadTextureForObject('RightWall', './DL89E_diffuse.jpg');
        loadTextureForObject('FrontWall', './DL89E_diffuse.jpg');
        loadTextureForObject('BackWall', './DL89E_diffuse.jpg');
        loadTextureForObject('Floor','nero marquina.jpg');
        loadTextureForObject('Bumper','черная нержавеющая сталь.jpg');
        loadTextureForObject('Door','шлифованная нержавейка.jpg');
        loadTextureForObject('Сeiling','P01.jpg');
        loadTextureForObject('Scoreboard','TL-D70.png');
        loadTextureForObject('PreScoreBoard','зеркало.jpg');
        loadTextureForObject('FrontMetalicWall','DL89E_glossiness.jpg');

        // Центрирование модели
        const box = new THREE.Box3().setFromObject(elevatorModel);
        const center = box.getCenter(new THREE.Vector3());
        elevatorModel.position.sub(center);
        scene.add(elevatorModel);
    }, undefined, (error) => {
        console.error('Error loading FBX model:', error);
    });

    // Инициализация OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxDistance = 500;
    controls.minDistance = 2;
    controls.target.set(0, 0, 0);

    animate();
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const liftContainer = document.getElementById('lift-container');
    const width = liftContainer.clientWidth;
    const height = liftContainer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


// Функция для загрузки текстуры и применения её к объекту
export function loadTextureForObject(objectName, texturePath){
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
}

// Функция для применения нового материала
function applyNewMaterial(obj, newMaterial) {
    obj.material = newMaterial;  // Применение нового материала
    obj.material.needsUpdate = true;  // Обновление материала
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}