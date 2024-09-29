document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.next-btn');
    const forms = document.querySelectorAll('.form-step');
    const progress = document.querySelector('.progress');
    let currentStep = 0;

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeat-password');

    const usernameHint = document.getElementById('username-hint');
    const passwordHint = document.getElementById('password-hint');
    const passwordMatchHint = document.getElementById('password-match-hint');

    function isUsernameValid() {
        const username = usernameInput.value.trim();
        return username.length >= 5;
    }

    function isPasswordValid() {
        const password = passwordInput.value.trim();
        const byteLength = new TextEncoder().encode(password).length;
        const containsAlphabet = /[a-zA-Z]/.test(password);
        return password.length >= 8 && byteLength <= 72 && containsAlphabet; 
    }

    function doPasswordsMatch() {
        return passwordInput.value === repeatPasswordInput.value;
    }

    function isStepValid() {
        const inputs = forms[currentStep].querySelectorAll('input');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        
        if (currentStep === 1) {
            if (!isUsernameValid()) {
                usernameHint.style.color = 'red';
                return false;
            } else {
                usernameHint.style.color = 'var(--accent-dark)';
            }

            if (!isPasswordValid()) {
                passwordHint.style.color = 'red';
                return false;
            } else {
                passwordHint.style.color = 'var(--accent-dark)';
            }

            if (!doPasswordsMatch()) {
                passwordMatchHint.style.color = 'red';
                return false;
            } else {
                passwordMatchHint.style.color = 'var(--accent-dark)';
            }
        }

        return true;
    }

    function showNextStep() {
        if (!isStepValid()) {
            alert("Bitte fülle alle Felder korrekt aus, um fortzufahren.");
            return;
        }
        forms[currentStep].classList.remove('active');
        currentStep++;
        forms[currentStep].classList.add('active');
        const progressPercentage = (currentStep / (forms.length - 1)) * 100;
        progress.style.width = progressPercentage + '%';
    }

    function showPreviousStep() {
        if (currentStep > 0) {
            forms[currentStep].classList.remove('active');
            currentStep--;
            forms[currentStep].classList.add('active');
            const progressPercentage = (currentStep / (forms.length - 1)) * 100;
            progress.style.width = progressPercentage + '%';
        }
    }

    // real-time validation for inputs
    usernameInput.addEventListener('input', () => {
        if (isUsernameValid()) {
            usernameHint.style.color = 'var(--accent-dark)';
        } else {
            usernameHint.style.color = 'red';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (isPasswordValid()) {
            passwordHint.style.color = 'var(--accent-dark)';
        } else {
            passwordHint.style.color = 'red';
        }
    });

    repeatPasswordInput.addEventListener('input', () => {
        if (doPasswordsMatch()) {
            passwordMatchHint.style.color = 'var(--accent-dark)';
        } else {
            passwordMatchHint.style.color = 'red';
        }
    });

    nextButtons.forEach((button) => {
        button.addEventListener('click', showNextStep);
    });

    window.showPreviousStep = showPreviousStep;
});
