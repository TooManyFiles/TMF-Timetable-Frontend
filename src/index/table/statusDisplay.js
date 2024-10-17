export function setLastRefreshed(time){
    document.getElementById('status-display-text').textContent = `Zuletzt aktualisiert: ${time}`;
    document.getElementById('loader').style.display = 'none';
}

export function setLoading(){
    document.getElementById('status-display-text').textContent = 'Wird aktualisiert...';
    document.getElementById('loader').style.display = 'flex';
}

export function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return(`${hours}:${minutes}:${seconds}`);
}


window.setLastRefreshed = setLastRefreshed;
window.setLoading = setLoading;
window.getCurrentTime = getCurrentTime;