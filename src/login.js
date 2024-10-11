import { login } from "./api/auth.js";

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way
    
    const button = document.querySelector('.button');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    setLoadingButton(button, true);
    
    try {
        const result = await login(username, password);

        if (result.status === 401) {
            alert('Falsche Logindaten (401)');
        } else if (result.status === 200) {
            console.log("Logged in successfully.");
            location.href = '/index.html'
        } else {
            alert('Login failed: ' + (result.message || 'An unexpected error occurred.'));
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    } finally {
        setLoadingButton(button, false); // Reset the button state
    }
});


function setLoadingButton(button, isLoading) {
    const loadingDots = button.querySelector('.loading-dots');
    const buttonText = button.querySelector('.button-text');

    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading'); 
        loadingDots.style.display = 'inline-block';
        buttonText.style.display = 'none';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        loadingDots.style.display = 'none';
        buttonText.style.display = 'inline';
    }
}
