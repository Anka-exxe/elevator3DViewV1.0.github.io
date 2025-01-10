function selectWall(button) {
    const buttons = button.parentNode.querySelectorAll('.wall-parameter-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const target = button.dataset.target;
}

function selectParameterButton(button) {
const container = button.parentNode; 
const buttons = container.querySelectorAll('.parameter-button'); 
buttons.forEach(btn => {
    btn.classList.remove('active'); 
});
button.classList.add('active'); 
}

function selectManyParameterButton(button) {
const container = button.parentNode; 
const buttons = container.querySelectorAll('.parameter-button'); 

if (button.classList.contains('active')) {
    button.classList.remove('active');
}
else {
    button.classList.add('active'); 
}
}

function selectLiftPosition(button) {
    const container = button.parentNode;
    const buttons = container.querySelectorAll('.parameter-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}