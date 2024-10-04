import { login } from "./api/auth.js";

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const result = await login(username, password);
        alert('Login erfolgreich!');
        // Redirect user to a different page or perform other actions on successful login
        window.location.href = '/'; // Example of a redirect after login
    } catch (error) {
        alert('Login fehlgeschlagen: ' + error.message);
    }
});