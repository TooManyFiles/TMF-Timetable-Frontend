import { register, updateUntisAccount, login } from "../api/auth.js";
import { postChoice } from "../api/choice.js";
import { getUserSetting } from "../api/settings.js";

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
    function finishRegistration() {
        if (!isStepValid()) {
            alert("Bitte fülle alle Felder korrekt aus, um fortzufahren.");
            return;
        }
        forms[currentStep].classList.remove('active');
        currentStep++;
        forms[currentStep].classList.add('active');
        const progressPercentage = (currentStep / (forms.length - 1)) * 100;
        progress.style.width = progressPercentage + '%';
        // name: document.getElementById('forename').value.trim()+" "+document.getElementById('lastname').value.trim(),
        const userData = {
            email: document.getElementById('email').value.trim(),
            name: document.getElementById('username').value.trim(),
            role: "student",
            classes: [
                1
            ],
            defaultChoice: {
                id: 0,
                name: "Normal",
                userId: 0,
                Choice: {}
            }
        };
        const password = document.getElementById('password').value.trim();
        register(userData, password).then((resultregister) => {
            login(userData.name, password).then((result) => {
                if (result.status === 200) {
                    const untisUsername = document.getElementById('untis-username').value.trim();
                    const untisPassword = document.getElementById('untis-password').value.trim();
                    const forename = document.getElementById('forename').value.trim();
                    const surname = document.getElementById('lastname').value.trim();
                    if (untisUsername && untisPassword) {
                        updateUntisAccount(forename, surname, untisUsername, untisPassword).then(() => {
                            getUserSetting("untis", "classId").then((res) => {
                                if (res.status === 200) {
                                    const userClass = res.data;
                                    postChoice(-1, -1, { Choice: { ["" + userClass]: [] } }).then(() => {
                                        window.location.href = '/index.html';
                                    }).catch((error) => {
                                        console.error("Fehler beim Speichern der Wahl:", error);
                                        window.location.href = '/settings.html';
                                    });
                                }
                            }).catch((error) => {
                                console.error("Fehler beim Abrufen der Benutzereinstellung:", error);
                                window.location.href = '/settings.html';
                            });
                        }).catch((error) => {
                            alert("Registrierung erfolgreich, aber das Verbinden deines Untis-Kontos ist fehlgeschlagen: " + error.message);
                            window.location.href = '/settings.html#untis';
                        });
                    } else {
                        window.location.href = '/index.html';
                    }
                } else {
                    alert('Login nach der Registrierung fehlgeschlagen: ' + (result.message || 'Ein unerwarteter Fehler ist aufgetreten.'));
                    window.location.href = '/login.html';
                }
            }).catch((error) => {
                alert('Login nach der Registrierung fehlgeschlagen: ' + error.message);
                window.location.href = '/login.html';
            });
        }).catch((error) => {
            alert("Registrierung fehlgeschlagen: " + error.message);
            showPreviousStep();
        });


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
    window.finishRegistration = finishRegistration;
});
