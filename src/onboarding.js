document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.next-btn');
    const forms = document.querySelectorAll('.form-step');
    const progress = document.querySelector('.progress');
    let currentStep = 0;

    //check if all inputs are filled
    function isStepValid() {
        const inputs = forms[currentStep].querySelectorAll('input');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    function showNextStep() {
        // if (!isStepValid()) {
        //     alert("Bitte fülle alle Felder aus, um fortzufahren.");
        //     return;
        // }
        forms[currentStep].classList.remove('active');
        currentStep++;
        forms[currentStep].classList.add('active');

        //progrss bar
        const progressPercentage = (currentStep / (forms.length - 1)) * 100;
        progress.style.width = progressPercentage + '%';
    }


    function showPreviousStep() {
        if (currentStep > 0) {
            forms[currentStep].classList.remove('active');
            currentStep--;
            forms[currentStep].classList.add('active');

            // progrs bar
            const progressPercentage = (currentStep / (forms.length - 1)) * 100;
            progress.style.width = progressPercentage + '%';
        }
    }

    nextButtons.forEach((button) => {
        button.addEventListener('click', showNextStep);
    });
    
    window.showPreviousStep = showPreviousStep;
});


