import { setErrorDisplay } from '../errorDisplay.js';

const apiurl = 'localhost:8080';

export async function getMenu(date, duration) {
    const query = `?date=${date}&duration=${duration}`;

    try {
        const response = await fetch(`http://${apiurl}/cafeteria${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('menuData', JSON.stringify(result));
            console.log("Menu data updated & saved to localstorage")
        } else {
            setErrorDisplay(response.status);
        }
    } catch (error) {
        setErrorDisplay(error);
    }
}

export function clearMenuData() {
    localStorage.removeItem('menuData');
    document.getElementById('output').textContent = 'Stored data cleared.';
}