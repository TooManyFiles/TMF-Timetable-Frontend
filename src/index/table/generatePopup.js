import { createClassContainer, createTeacherContainer, createRoomContainer, createSubjectContainer  } from "./dataContainer.js";
export function generateLessonPopup(id) {
    // Retrieve the lessons from local storage (or wherever your data is stored)
    const lessons = JSON.parse(localStorage.getItem('lessons')) || [];

    // Find the lesson by ID
    const lesson = lessons.find(lesson => lesson.id === id);

    // Check if the lesson was found
    if (lesson) {
        // Display the relevant data in the popup
        let popup = document.getElementById('lesson-popup');
        let popupContent = popup.getElementsByClassName("popup-content")[0];

        if (lesson.cancelled){
            popupContent.classList.add('cancelled');
        } else {
            popupContent.classList.remove('cancelled');
        }

        const existingPTags = popupContent.querySelectorAll('p, div');
        existingPTags.forEach(p => p.remove());

        // Subject and Time
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('popup-centered');

        const subjectHeading = document.createElement('h2');
        subjectHeading.id = 'subjects';
        const subjectContainer = createSubjectContainer(lesson.subjects, lesson.originalSubjects);
        subjectContainer.classList.add('multiElement');
        subjectHeading.appendChild(subjectContainer);
        subjectDiv.appendChild(subjectHeading);

        const divider = document.createElement('hr');
        divider.classList.add('popup-divider');
        subjectDiv.appendChild(divider);

        const timePara = document.createElement('p');
        timePara.id = 'time';
        timePara.textContent = `${window.timeToReadable(lesson.startTime)} - ${window.timeToReadable(lesson.endTime)}`;
        subjectDiv.appendChild(timePara);

        popupContent.appendChild(subjectDiv);

        // Helper function to create a label and value pair
        function createField(labelText, fieldId, fieldValue) {
            const fieldPara = document.createElement('p');
            const label = document.createElement('strong');
            label.textContent = `${labelText}: `;
            fieldPara.appendChild(label);

            if (fieldValue instanceof HTMLElement) {
                fieldValue.id = fieldId;
                fieldValue.classList.add('multiElement');
                fieldPara.appendChild(fieldValue);
            } else {
                const valueSpan = document.createElement('span');
                valueSpan.id = fieldId;
                valueSpan.textContent = fieldValue || "";
                fieldPara.appendChild(valueSpan);
            }

            return fieldPara;
        }

        // Generate all fields dynamically
        const teacherContainer = createTeacherContainer(lesson.teachers, lesson.originalTeachers);
        popupContent.appendChild(createField("Lehrkraft", "teachers", teacherContainer));

        const roomContainer = createRoomContainer(lesson.rooms, lesson.originalRooms);
        popupContent.appendChild(createField("Raum", "rooms", roomContainer));

        const classContainer = createClassContainer(lesson.classes, lesson.originalClasses);
        popupContent.appendChild(createField("Klasse", "classes", classContainer));

        popupContent.appendChild(createField("Info", "info", lesson.additionalInformation));
        popupContent.appendChild(createField("Entfall", "cancelled", lesson.cancelled ? "Ja" : ""));
        popupContent.appendChild(createField("Irregulär", "irregular", lesson.irregular ? "Ja" : ""));
        popupContent.appendChild(createField("Vertretungsinfo", "substitutionText", lesson.substitutionText));
        popupContent.appendChild(createField("Stundeninfo", "lessonText", lesson.lessonText));
        popupContent.appendChild(createField("Buchungsinfo", "bookingText", lesson.bookingText));
        popupContent.appendChild(createField("Hausaufgaben", "homework", lesson.homework));
        popupContent.appendChild(createField("Aufstuhlen", "chairUp", lesson.chairUp ? "Ja" : ""));
        popupContent.appendChild(createField("Letztes Update", "lastUpdate", window.dateAndTimeToReadable(lesson.lastUpdate)));

        // Disable scrolling
        document.body.style.overflow = 'hidden';

        // Display the popup
        document.getElementById('lesson-popup').style.display = 'flex';
        updateGradientRatio(popupContent);
    }
}


function closeLessonPopup() {
    document.getElementById('lesson-popup').style.display = 'none';
    
    // Re-enable scrolling
    document.body.style.overflow = '';
}

// Attach the event listener to a parent element, like the document or a specific container
document.addEventListener('click', (event) => {
    // Check if the clicked element has a 'lessonid' attribute
    const target = event.target.closest('[lessonid]');
    
    if (target) {
        // Get the lessonid attribute value
        const lessonid = target.getAttribute('lessonid');
        
        // Call the function with lessonid
        generateLessonPopup(lessonid-0);
    }
});

// CAFE POPUP
export function generateCafePopup(date, main_dish, vegetarian_dish, salad, desert, cooking_team) {
    document.getElementById('date').textContent = date;
    document.getElementById('main_dish').textContent = main_dish;
    document.getElementById('vegetarian_dish').textContent = vegetarian_dish;
    document.getElementById('salad').textContent = salad;
    document.getElementById('desert').textContent = desert;
    document.getElementById('cooking_team').textContent = cooking_team;
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    document.getElementById('cafe-popup').style.display = 'flex';
}

function closeCafePopup() {
    document.getElementById('cafe-popup').style.display = 'none';
    
    // Re-enable scrolling
    document.body.style.overflow = '';
}


document.getElementById('lesson-popup').addEventListener('click', function () {
    closeLessonPopup();
});
document.getElementById('cafe-popup').addEventListener('click', function () {
    closeCafePopup();
});
function updateGradientRatio(element) {
    const height = element.offsetHeight;
    const width = element.offsetWidth;
    const ratio = height / width;
    element.style.setProperty('--ratio', ratio);
}

window.generateCafePopup = generateCafePopup
window.closeCafePopup = closeCafePopup
window.generateLessonPopup = generateLessonPopup
window.closeLessonPopup = closeLessonPopup