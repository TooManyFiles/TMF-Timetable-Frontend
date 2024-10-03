import { setErrorDisplay } from '../errorDisplay.js';
import { apiurl } from '../config.js';

export async function getAllSubjects(accesstoken) {
    const url = `${apiurl}/untis/subjects`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        }
      });
  
      if (response.status === 200) {
        const subjects = await response.json();
        console.log('List of subjects:', subjects);
        return subjects;
      } else if (response.status === 401) {
        console.error('Unauthorized - Authentication required');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
}
  

export async function getAllTeachers(accesstoken) {
    const url = `http://${apiurl}/untis/teachers`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        }
      });
  
      if (response.status === 200) {
        const teachers = await response.json();
        console.log('List of teachers:', teachers);
        return teachers;
      } else if (response.status === 401) {
        console.error('Unauthorized - Authentication required');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
}


export async function getAllClasses(accesstoken) {
    const url = `http://${apiurl}/untis/classes`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        }
      });
  
      if (response.status === 200) {
        const classes = await response.json();
        console.log('List of classes:', classes);
        return classes;
      } else if (response.status === 401) {
        console.error('Unauthorized - Authentication required');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
}

async function getAllRooms(accesstoken) {
    const url = `http://${apiurl}/untis/rooms`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        }
      });
  
      if (response.status === 200) {
        const rooms = await response.json();
        console.log('List of rooms:', rooms);
        return rooms;
      } else if (response.status === 401) {
        console.error('Unauthorized - Authentication required');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
}

export async function fetchStaticData(accesstoken) {
    const url = `http://${apiurl}/untis/fetch`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        }
      });
  
      if (response.status === 200) {
        console.log('Successfully fetched static data.');
        return await response.json();
      } else if (response.status === 401) {
        console.error('Unauthorized - Authentication required');
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }
  