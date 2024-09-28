const display = document.getElementById('error-display');
const text = document.getElementById('error-display-text');


export function setErrorDisplay(e){
    text.textContent = e;
    display.style.display = 'block';
}

function showErrorDisplay(){
    display.style.display = 'block';
}

function closeErrorDisplay(){
    display.style.display = 'none';
}

window.closeErrorDisplay = closeErrorDisplay;