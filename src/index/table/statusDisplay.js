export function setLastRefreshed(time){
    time=asReadableLastRefreshed(time);
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

export function asReadableLastRefreshed(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isYesterday = date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (isToday) {
        return `${hours}:${minutes}:${seconds}`;
    } else if (isYesterday) {
        return `Gestern ${hours}:${minutes}:${seconds}`;
    } else {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
}


window.setLastRefreshed = setLastRefreshed;
window.setLoading = setLoading;
window.getCurrentTime = getCurrentTime;