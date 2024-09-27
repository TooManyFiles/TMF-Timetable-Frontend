display = document.getElementById('error-display');
text = document.getElementById('error-display-text');


function setErrorDisplay(e){
    text.textContent = e;
    display.style.display = 'block';
}

function showErrorDisplay(){
    display.style.display = 'block';
}

function closeErrorDisplay(){
    display.style.display = 'none';
}