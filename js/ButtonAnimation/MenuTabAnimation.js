import { showImages } from './showImg.js';

export function showTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
    switch(tabId){
        case "WallsParametersTab":
        showImages('walls', tabId);
        break;
        case "DoorParametrsTab":
        showImages('door', tabId);
        break;
        case "CeilingParametrsTab":
        showImages('ceiling', tabId);
        break;
        case "FloorParametrsTab":
        showImages('floor', tabId);
        break;
        case "BoardParametrsTab":
        showImages('board', tabId);
        break;
    }
}

document.getElementById('WallsTab').addEventListener('click', function() {
    showTab('WallsParametersTab');
});

window.showTab = showTab;
