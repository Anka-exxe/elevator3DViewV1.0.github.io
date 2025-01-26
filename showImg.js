import { loadTextureForObject } from './tree.js';
import * as list from './constants.js';
import {DisplayVertical} from "./constants.js";

const images = {
    walls: [
        './Стены/5024.jpg', 
        './Стены/DL16CE_diffuse.jpg',
        './Стены/DL16CE_gray.jpg',
        './Стены/DL16CE_normal.jpg',
        './Стены/DL16CE_roughness.jpg',
        './Стены/DL89E_diffuse.jpg',
        './Стены/DL89E_glossiness.jpg',
        './Стены/DL89E_gray.jpg',
        './Стены/DL89E_normal.jpg',
        './Стены/HL Ti-Gold.jpg',
        './Стены/HY-003 TI-GOLD.jpg',
        './Стены/HY-004 TI-GOLD.jpg',
        './Стены/RAL-7035-Svetlo-serii.png',
        './Стены/шлифованная нержавейка.jpg',
    ],
    ceiling: [
        './Потолок/00.png', 
        './Потолок/01.jpg', 
        './Потолок/1.jpg', 
        './Потолок/2.jpg',
        './Потолок/6.png',
        './Потолок/07.jpg',
        './Потолок/7.png',
        './Потолок/8.png',
        './Потолок/9.png',
        './Потолок/11.png',
        './Потолок/21.jpg',
        './Потолок/P23.jpg',
        './Потолок/Безымянный-2.png',
        './Потолок/Р04.jpg',

    ],
    floor: [
        './Пол/nero marquina.jpg', 
        './Пол/WoodFlooring042_COL_4K.jpg',  
        './Пол/basalt-grey.jpg',  
        './Пол/antik2.png', 
        './Пол/WoodFlooring042_DISP_4K.jpg',
    ],
    board: [
        './Табло/TL-D70.png', 
        './Табло/BUTSAN TABLO.jpg',
        './Табло/BUTSAN1-01.jpg', 
        './Табло/BUTSAN1-01111.jpg',        
    ],
    door: [
        './Двери/HL Ti-Gold.jpg',
        './Двери/HY-003 TI-GOLD.jpg', 
        './Двери/HY-004 TI-GOLD.jpg',
        './Двери/RAL-7035-Svetlo-serii.png',
        './Двери/ral9016.jpg',
        './Двери/шлифованная нержавейка.jpg',
    ]
};

window.showImages = function(element, tabName) {
// Получаем контейнер по ID
const Tab = document.getElementById(tabName);

// Ищем элемент внутри этого контейнера
const content = Tab.querySelector('.image-content');

    content.innerHTML = ''; // Очищаем предыдущие изображения
    images[element].forEach((image, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        const img = document.createElement('img');
        img.src = image;
        img.alt = '${element} image';
        imgContainer.appendChild(img);
        content.appendChild(imgContainer);

        if (element === 'door'){
            img.addEventListener('click', () => {
                loadTextureForObject(list.elements.Door, image);
            });
        }
        else if(element === 'ceiling'){
            img.addEventListener('click', () => {
                loadTextureForObject(list.elements.Lamp, image);
            });
        }
        else if (element === 'walls') {
            img.addEventListener('click', () => {
                console.log(document.querySelectorAll('.wall-parameter-button'));
                const activeButton = document.querySelector('.wall-parameter-button.active');
                if (!activeButton) {
                    console.error('Active button not found');
                    return;
                }
                const target = activeButton.dataset.target;
                console.log(`Target value: ${target}`);
                applyTextureToWall(target, image); // Передаём target и путь текстуры
            });
        }
        else if(element === 'floor'){
            img.addEventListener('click', () => {
                loadTextureForObject(list.Floor, image);
                loadTextureForObject(list.elements.Bumper, image);
            });
        }
        else if(element === 'board'){
            img.addEventListener('click', () => {
                loadTextureForObject(list.DisplayVertical,image);
            });
        }
    });
};

function applyTextureToWall(target, texturePath) {
    if (target === 'all') {
        ['LeftWall', 'RightWall', 'FrontWall', 'BackWall'].forEach(partName => {
            console.log(`Applying texture to ${partName}`);
            loadTextureForObject(list.elements[partName], texturePath);
        });
    } else {
        const partName = getWallPartName(target);
        if (partName) {
            console.log(`Applying texture to all parts of ${partName}`);
            loadTextureForObject(list.elements[partName], texturePath);
        } else {
            console.warn(`Target "${target}" does not match any wall part.`);
        }
    }
}


// Вспомогательная функция для сопоставления целевых частей модели
function getWallPartName(target) {
    const wallParts = {
        left: 'LeftWall',
        right: 'RightWall',
        front: 'FrontWall',
        back: 'BackWall'
    };
    return wallParts[target];
}