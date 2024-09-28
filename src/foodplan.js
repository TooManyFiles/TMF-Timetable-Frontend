import { dateToString, getMonday, getThursday, getTuesday, getWednesday } from './utils.js';
import { getMenu } from './api/cafe.js';
import { setErrorDisplay } from './errorDisplay.js';

// Check for existing stored data on page load
document.addEventListener('DOMContentLoaded', async function() {
    const storedData = localStorage.getItem('menuData');

    if (storedData) {
        const menuData = JSON.parse(storedData);
        if (menuData && Array.isArray(menuData)) {
            displayMenu();
        } else {
            setErrorDisplay("No menu data found or data is not an array.");
        }
    } else {
        await fetchAndDisplayMenu();
    }
});

export async function fetchAndDisplayMenu() {
    try {
        await getMenu(dateToString(getMonday()), 3);
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        if (menuData && Array.isArray(menuData)) {
            displayMenu();
        } else {
            setErrorDisplay("No menu data found or data is not an array.");
        }
    } catch (error) {
        setErrorDisplay("Error fetching menu data.");
    }
}

function displayMenu() {
    document.getElementById('cafepreview-mon').textContent = getMenuDetails(dateToString(getMonday())).mainDish;
    document.getElementById('cafepreview-tue').textContent = getMenuDetails(dateToString(getTuesday())).mainDish;
    document.getElementById('cafepreview-wed').textContent = getMenuDetails(dateToString(getWednesday())).mainDish;
    document.getElementById('cafepreview-thu').textContent = getMenuDetails(dateToString(getThursday())).mainDish;
}

function getMenuDetails(date){
    const menuData = JSON.parse(localStorage.getItem('menuData'));
    if (menuData && Array.isArray(menuData)) {
      const menuForDate = menuData.find(item => item.date === date);
      return menuForDate ? menuForDate : `No menu found for the date: ${date}`;
    } else {
      setErrorDisplay("No menu data found or data is not an array.");
    }
}

window.getMenuDetails = getMenuDetails;
