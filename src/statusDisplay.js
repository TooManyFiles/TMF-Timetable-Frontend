function setLastRefreshed(time){
    document.getElementById('status-display-text').textContent = `Zuletzt aktualisiert: ${time}`;
    document.getElementById('loader').style.display = 'none';
}

function setLoading(){
    document.getElementById('status-display-text').textContent = 'Wird aktualisiert...';
    document.getElementById('loader').style.display = 'flex';
}

function getCurrentTime(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return(`${hours}:${minutes}:${seconds}`);
}