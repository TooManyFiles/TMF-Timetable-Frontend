import { API_URL } from "../config.js";

// Login function
export async function login(username, password) {
    try {
        const response = await fetch(API_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.removeItem('lessons'); //TEST THIS!!!!
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw error;
    }
}

// Logout function
export async function logout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
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

window.getCurrentUser = getCurrentUser;
window.logout = logout;
