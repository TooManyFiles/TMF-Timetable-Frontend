// WHEN ITS SAT / SUN, THESE DATE FUNCTIONS RETURN THE DATES OF THE NEXT WEEK!!
import { timeGrid } from "../config.js";
import { getCurrentUser } from "../api/auth.js";
let currentMonday = null;

function setCurrentMonday(date) {
    if (date) {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0); // Set to midnight (00:00:00.000)
        const dayOfWeek = today.getDay();
        // Calculate the difference to Monday of the current or next week
        let differenceToMonday;

        if (dayOfWeek >= 6) { // Saturday or Sunday, move to next week's Monday
            differenceToMonday = dayOfWeek - 8; // (7 + 1) - dayOfWeek for the upcoming Monday
        } else {
            differenceToMonday = dayOfWeek - 1; // Normal difference for current week's Monday
        }

        const monday = new Date(today);
        monday.setDate(today.getDate() - differenceToMonday);
        currentMonday = new Date(monday);
        return monday;
    } else {
        currentMonday = getMonday();
    }
}

export function switchWeek(offset) {
    // offset = number of weeks (e.g., -1 = previous, +1 = next)
    if (!currentMonday) {
        currentMonday = getMonday();
    }

    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + offset * 7);

    setCurrentMonday(newMonday);
    if (window.refreshAll)
        window.refreshAll();
}
function getMondayofDate(date) {
    const dateDate = new Date(date);
    dateDate.setHours(0, 0, 0, 0);
    const dayOfWeek = dateDate.getDay();
    let differenceToMonday;

    if (dayOfWeek >= 6) { // Saturday/Sunday → next week
        differenceToMonday = dayOfWeek - 8;
    } else {
        differenceToMonday = dayOfWeek - 1;
    }

    const monday = new Date(dateDate);
    monday.setDate(dateDate.getDate() - differenceToMonday);
    return monday;  
}

export function getMonday() {
    if (currentMonday) {
        return new Date(currentMonday);
    }

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const kwParam = parseInt(params.get("kw"));
    const yearParam = parseInt(params.get("year"));

    if (!isNaN(kwParam) && !isNaN(yearParam)) {
        // Calculate Monday from week/year
        // ISO 8601: Week 1 is the week with the first Thursday of the year
        // Set date to the Thursday in the target week
        const simpleDate = new Date(yearParam, 0, 4); // Jan 4th is always in week 1
        const dayOfWeek = simpleDate.getDay() || 7; // Make Sunday (0) become 7
        simpleDate.setDate(simpleDate.getDate() - (dayOfWeek - 1) + (kwParam - 1) * 7);
        // Now simpleDate is the Monday of the desired week

        currentMonday = new Date(getMondayofDate(simpleDate));
        return currentMonday;
    }

    // Fallback: heutige Woche
    const today = new Date();
    currentMonday = new Date(getMondayofDate(today));
    return currentMonday;
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

export function getFriday() {
    const monday = getMonday();
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return friday;
}
export function getKW(dateInput) {
    const d = dateInput ? new Date(dateInput) : getMonday();
    // ISO 8601: Montag = 1, Sonntag = 7
    const dayOfWeek = (d.getDay() + 6) % 7 + 1; // Montag=1 ... Sonntag=7
    // Donnerstag der aktuellen Woche
    const thursday = new Date(d);
    thursday.setDate(d.getDate() + (4 - dayOfWeek));

    const yearStart = new Date(Date.UTC(thursday.getFullYear(), 0, 1));
    const weekNo = Math.ceil((((thursday - yearStart) / 86400000 + 1) / 7));

    return { kw: weekNo, year: thursday.getFullYear() };
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

export function datestringToReadableSHORT(dateString) {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'long'
    };
    return date.toLocaleDateString('de-DE', options);
}

export function dateAndTimeToReadable(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
}
export function timeToReadable(dateString) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', options);
}
export function dateToReadable(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
}


export function timeToSchoolTimeGrid(dateInput) {

    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = (date.getDay() + 1) % 7;

    // Find the matching day in the grid (grid.day: 2 = Monday, 3 = Tuesday, ..., 6 = Friday)
    const dayGrid = timeGrid.find(dayObj => dayObj.day === dayOfWeek);

    // If no matching day found, return null (e.g., Sunday)
    if (!dayGrid) return null;

    // Convert the time from the Date object to an integer (HHMM format)
    const time = (date.getHours()) * 100 + date.getMinutes();

    // Find the corresponding time unit within the day's timeUnits
    const matchingTimeUnit = dayGrid.timeUnits.find(unit => time >= unit.startTime && time < unit.endTime);

    // Return the matched time unit, or null if no match found
    return matchingTimeUnit || null;
}

export function getOneLetterDayCode(dateInput) {
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);

    // Array mapping days of the week to one-letter codes
    const dayCodes = ['s', 'm', 't', 'w', 'th', 'f', 's']; // Sunday to Saturday
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return dayCodes[dayIndex]; // Return the corresponding one-letter code
}

async function isLoggedIn() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        if (error.message.includes("401")) {
            console.log("Session expired or unauthorized, redirecting to login...");
            return false;
        } else {
            console.error("Error checking login status:", error);
        }
    }
}



window.isLoggedIn = isLoggedIn;
window.switchWeek = switchWeek;
window.getMondayofDate = getMondayofDate;
window.getMonday = getMonday;
window.getTuesday = getTuesday;
window.getWednesday = getWednesday;
window.getThursday = getThursday;
window.dateToString = dateToString;
window.getFriday = getFriday;
window.getKW = getKW;
window.datestringToReadable = datestringToReadable;
window.datestringToReadableSHORT = datestringToReadableSHORT;
window.dateAndTimeToReadable = dateAndTimeToReadable;
window.timeToReadable = timeToReadable;
window.dateToReadable = dateToReadable;