// WHEN ITS SAT / SUN, THESE DATE FUNCTIONS RETURN THE DATES OF THE NEXT WEEK!!

export function getMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Calculate the difference to Monday of the current or next week
    let differenceToMonday;
    
    if (dayOfWeek >= 6) { // Saturday or Sunday, move to next week's Monday
        differenceToMonday = 8 - dayOfWeek; // (7 + 1) - dayOfWeek for the upcoming Monday
    } else {
        differenceToMonday = dayOfWeek - 1; // Normal difference for current week's Monday
    }

    const monday = new Date(today);
    monday.setDate(today.getDate() - differenceToMonday);
    return monday;
}

// Calc the other dates based on monday
export function getTuesday() {
    const monday = getMonday();
    const tuesday = new Date(monday);
    tuesday.setDate(monday.getDate() + 1); 
    return tuesday;
}

export function getWednesday() {
    const monday = getMonday();
    const wednesday = new Date(monday);
    wednesday.setDate(monday.getDate() + 2);
    return wednesday;
}

export function getThursday() {
    const monday = getMonday();
    const thursday = new Date(monday);
    thursday.setDate(monday.getDate() + 3);
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