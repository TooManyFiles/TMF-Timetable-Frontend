import { API_URL } from "../config.js";
import { setErrorDisplay } from "../generic/errorDisplay.js";

/**
 * Get choices by userId
 * @param {number} userId
 * @returns {Promise<{status:number, data?:Array, message?:string}>}
 */
export async function getChoicesByUserId(userId) {
    try {
        const response = await fetch(`${API_URL}users/${userId}/choices`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // send cookies if needed for auth
        });

        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = [];
        }

        if (response.ok) {
            // optional: store in localStorage
            localStorage.setItem('choices', JSON.stringify(data));
            return { status: 200, data };
        } else if (response.status === 404) {
            setErrorDisplay('User not found');
            return { status: 404, message: 'User not found' };
        } else {
            const errorMessage = data.message || 'Failed to fetch choices';
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}

/**
 * Get a single choice by userId and choiceId
 * @param {number} userId
 * @param {number} choiceId
 * @returns {Promise<{status:number, data?:object, message?:string}>}
 */
export async function getChoice(userId, choiceId) {
    try {
        const response = await fetch(`${API_URL}users/${userId}/choices/${choiceId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const contentType = response.headers.get('Content-Type');
        let data = contentType && contentType.includes('application/json') 
            ? await response.json() 
            : {};

        if (response.ok) {
            return { status: 200, data };
        } else if (response.status === 404) {
            setErrorDisplay('User or choice not found');
            return { status: 404, message: 'User or choice not found' };
        } else {
            const errorMessage = data.message || 'Failed to fetch choice';
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}

/**
 * Modify or create a choice by userId and choiceId
 * @param {number} userId
 * @param {number} choiceId
 * @param {object} choiceData
 * @returns {Promise<{status:number, data?:object, message?:string}>}
 */
export async function postChoice(userId, choiceId, choiceData) {
    try {
        const response = await fetch(`${API_URL}users/${userId}/choices/${choiceId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(choiceData)
        });

        const contentType = response.headers.get('Content-Type');
        let data = contentType && contentType.includes('application/json') 
            ? await response.json() 
            : {};

        if (response.ok) {
            return { status: 200, data };
        } else if (response.status === 404) {
            setErrorDisplay('User or choice not found');
            return { status: 404, message: 'User or choice not found' };
        } else {
            const errorMessage = data.message || 'Failed to update choice';
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}
