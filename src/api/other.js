import { API_URL } from "../config.js";

export async function getWeek(date) {
    const url = `${API_URL}week/${date}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: "include"
      });
      
      return await response.json();
    }
    catch (error) {
      console.error('Request failed:', error);
    }
}


window.getWeek = getWeek;