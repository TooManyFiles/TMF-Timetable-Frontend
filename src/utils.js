export function getMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const differenceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const monday = new Date(today);
    monday.setDate(today.getDate() - differenceToMonday);
    return monday;
}

export function getTuesday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const differenceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 2);
    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() - differenceToMonday);
    return tuesday;
}

export function getWednesday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const differenceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 3);
    const wednesday = new Date(today);
    wednesday.setDate(today.getDate() - differenceToMonday);
    return wednesday;
}

export function getThursday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const differenceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 4);
    const thursday = new Date(today);
    thursday.setDate(today.getDate() - differenceToMonday);
    return thursday;
}

export function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
}

export function datestringToReadable(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long'
    };
    return date.toLocaleDateString('de-DE', options);
}


window.getMonday = getMonday;
window.getTuesday = getTuesday;
window.getWednesday = getWednesday;
window.getThursday = getThursday;
window.dateToString = dateToString;
window.datestringToReadable = datestringToReadable