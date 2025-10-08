// api/userSettings.js
import { API_URL } from "../config.js";
import { setErrorDisplay } from "../generic/errorDisplay.js";

/**
 * Get a user setting
 * @param {string} settingType
 * @param {string} setting
 * @returns {Promise<{status:number, data?:any, message?:string}>}
 */
export async function getUserSetting(settingType, setting) {
    try {
        const response = await fetch(`${API_URL}user/settings/${settingType}/${setting}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.status === 204) {
            // Setting does not exist
            return { status: 204, data: null };
        }

        const contentType = response.headers.get('Content-Type');
        let data = contentType && contentType.includes('application/json')
            ? await response.json()
            : null;

        if (response.ok) {
            return { status: 200, data };
        } else if (response.status === 404) {
            setErrorDisplay("User not found");
            return { status: 404, message: "User not found" };
        } else if (response.status === 403) {
            setErrorDisplay("Setting is not allowed to be changed");
            return { status: 403, message: "Forbidden" };
        } else if (response.status === 401) {
            setErrorDisplay("Unauthorized");
            return { status: 401, message: "Unauthorized" };
        } else {
            const errorMessage = data?.message || "Failed to fetch setting";
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}

/**
 * Update a user setting
 * @param {string} settingType
 * @param {string} setting
 * @param {object|string} value
 * @returns {Promise<{status:number, data?:any, message?:string}>}
 */
export async function updateUserSetting(settingType, setting, value) {
    try {
        const response = await fetch(`${API_URL}user/settings/${settingType}/${setting}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(value),
        });

        const contentType = response.headers.get('Content-Type');
        let data = contentType && contentType.includes('application/json')
            ? await response.json()
            : null;

        if (response.ok) {
            return { status: 200, data };
        } else if (response.status === 404) {
            setErrorDisplay("User not found");
            return { status: 404, message: "User not found" };
        } else if (response.status === 403) {
            setErrorDisplay("Setting is not allowed to be changed");
            return { status: 403, message: "Forbidden" };
        } else if (response.status === 401) {
            setErrorDisplay("Unauthorized");
            return { status: 401, message: "Unauthorized" };
        } else {
            const errorMessage = data?.message || "Failed to update setting";
            setErrorDisplay(errorMessage);
            return { status: response.status, message: errorMessage };
        }
    } catch (error) {
        setErrorDisplay(error.message);
        return { status: 500, message: error.message };
    }
}
