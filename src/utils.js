// WHEN ITS SAT / SUN, THESE DATE FUNCTIONS RETURN THE DATES OF THE NEXT WEEK!!
import { timeGrid } from "./config.js";

export function getMonday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight (00:00:00.000)
    const dayOfWeek = today.getDay();
    // Calculate the difference to Monday of the current or next week
    let differenceToMonday;

    if (dayOfWeek >= 6) { // Saturday or Sunday, move to next week's Monday
        differenceToMonday = dayOfWeek- 8 ; // (7 + 1) - dayOfWeek for the upcoming Monday
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

export function getFriday() {
    const monday = getMonday();
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return friday;
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
    const dayOfWeek = (date.getDay()+1)%7;

    // Find the matching day in the grid (grid.day: 2 = Monday, 3 = Tuesday, ..., 6 = Friday)
    const dayGrid = timeGrid.find(dayObj => dayObj.day === dayOfWeek);

    // If no matching day found, return null (e.g., Sunday)
    if (!dayGrid) return null;

    // Convert the time from the Date object to an integer (HHMM format)
    const time = (date.getHours() - 2) * 100 + date.getMinutes();

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

window.getMonday = getMonday;
window.getTuesday = getTuesday;
window.getWednesday = getWednesday;
window.getThursday = getThursday;
window.dateToString = dateToString;
window.getFriday = getFriday;
window.datestringToReadable = datestringToReadable;
window.dateAndTimeToReadable = dateAndTimeToReadable;
window.timeToReadable = timeToReadable;
window.dateToReadable = dateToReadable;