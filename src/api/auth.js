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
                localStorage.removeItem('token');
            } else {
                throw new Error('Failed to logout');
            }
        }
    } catch (error) {
        throw error;
    }
}
