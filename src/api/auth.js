import { API_URL } from "../config.js";
import { setErrorDisplay } from "../generic/errorDisplay.js";
import { hashPasswordBool } from "../config.js";
import { hashPassword } from "../auth/hash.js";


export async function login(username, password) {
    try {
        if (hashPasswordBool) {
            password = hashPassword(password);
        }
        const response = await fetch(API_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json(); // Parse JSONs
        } else {
            data = {}; // Default to an empty object if no JSON is returned
        }

        // Handle success response
        if (response.ok) {
            localStorage.removeItem('lessons');
            return { status: 200 };
        } else {
            const errorMessage = data.message || 'An error occurred. Most likely wrong login credentials.';
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        //network or other unexpected errors
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}




// Logout function
export async function logout() {
    try {
        const response = await fetch(API_URL + 'logout', {
            method: 'POST',
            credentials: "include"
        });
        if (response.ok) {
            //Delete all localstorage items
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                localStorage.removeItem(key);
            }
            document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } else {
            throw new Error('Failed to logout');
        }

        window.location.href = '/login.html';
    } catch (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await fetch(API_URL + 'currentUser', {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        throw error;
    }
}


// register function

export async function register(userData, password) {
    try {
        if (hashPasswordBool) {
            password = hashPassword(password);
        }
        const response = await fetch(API_URL + 'users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ userData, password }),
        });

        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = {};
        }

        if (response.ok) {
            return { status: response.status, data };
        } else {
            const errorMessage = data.message || 'Registrierung fehlgeschlagen.';
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}

export async function updateUntisAccount(forename, surname, userName, untisPWD) {
    try {
        const response = await fetch(API_URL + 'user/untisAcc', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ forename, surname, userName, untisPWD }),
        });

        if (response.ok) {
            return { status: response.status };
        } else {
            const errorMessage = await response.text();
            setErrorDisplay(errorMessage || 'Aktualisierung fehlgeschlagen.');
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}


window.getCurrentUser = getCurrentUser;
window.logout = logout;
