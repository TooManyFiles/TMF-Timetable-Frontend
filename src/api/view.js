
import { apiurl } from "../config.js";
import { getMonday } from "../utils.js";
import { parseLessons } from "./untis.js";
export async function getView(date, duration) {
    const query = `?date=${date}&duration=${duration}`;
    const url = `${apiurl}view${query}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({

                "untis": {
                },
                "provider": [
                    "untis",
                    "cafeteria"
                ]

            }),
            credentials: "include"
        });

        if (response.status === 200) {
            const views = await response.json();
            console.log('List of views:', views);
            if (views.Untis) {
                parseLessons(views.Untis)
            }
            return views;
        } else if (response.status === 401) {
            console.error('Unauthorized - Authentication required');
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}
