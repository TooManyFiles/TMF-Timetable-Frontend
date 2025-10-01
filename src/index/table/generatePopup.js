import { createClassContainer, createTeacherContainer, createRoomContainer, createSubjectContainer } from "./dataContainer.js";
let popup = null;
let startY = 0;
function disableScroll() {
    popup = document.getElementById('popup-content');
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventTouchStart, { passive: false });
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    document.addEventListener('keydown', preventKeyScroll, { passive: false });
}

function enableScroll() {
    document.removeEventListener('wheel', preventScroll);
    document.removeEventListener('touchstart', preventTouchStart);
    document.removeEventListener('touchmove', preventTouchMove);
    document.removeEventListener('keydown', preventKeyScroll);
}

function preventScroll(e) {
    if (!popup) popup = document.getElementsByClassName('popup-content')[0];
    const scrollable = popup;
    if (!scrollable) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    if (!popup.contains(e.target)) {
        e.preventDefault();
    }
    const atTop = scrollable.scrollTop === 0;
    const atBottom = scrollable.scrollHeight - scrollable.scrollTop === scrollable.clientHeight;

    // If trying to scroll past top/bottom, prevent default
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();

    }
    e.stopPropagation();
}
// For touch events
function preventTouchStart(e) {
    startY = e.touches[0].clientY;
}

function preventTouchMove(e) {
    if (!popup) popup = document.getElementsByClassName('popup-content')[0];

    if (!popup || !popup.contains(e.target)) {
        e.preventDefault();
        return;
    }

    const scrollable = popup;
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;

    const atTop = scrollable.scrollTop === 0;
    const atBottom = scrollable.scrollHeight - scrollable.scrollTop === scrollable.clientHeight;

    if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
    }
}

function preventKeyScroll(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.code)) {
        e.preventDefault();
    }
}

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

        if (lesson.cancelled) {
            popupContent.classList.add('cancelled');
        } else {
            popupContent.classList.remove('cancelled');
        }
        if (lesson.irregular) {
            popupContent.classList.add('irregular');
        } else {
            popupContent.classList.remove('irregular');
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
        disableScroll();

        // Display the popup
        document.getElementById('lesson-popup').style.display = 'flex';
        updateGradientRatio(popupContent);
    }
}

function closeLessonPopup() {
    document.getElementById('lesson-popup').style.display = 'none';

    // Re-enable scrolling
    enableScroll();
}

// Attach the event listener to a parent element, like the document or a specific container
document.addEventListener('click', (event) => {
    // Check if the clicked element has a 'lessonid' attribute
    const target = event.target.closest('[lessonid]');

    if (target) {
        // Get the lessonid attribute value
        const lessonid = target.getAttribute('lessonid');

        // Call the function with lessonid
        generateLessonPopup(lessonid - 0);
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
    disableScroll();

    document.getElementById('cafe-popup').style.display = 'flex';
}

function closeCafePopup() {
    document.getElementById('cafe-popup').style.display = 'none';

    // Re-enable scrolling
    enableScroll();
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

window.generateCafePopup = generateCafePopup;
window.closeCafePopup = closeCafePopup;
window.generateLessonPopup = generateLessonPopup;
window.closeLessonPopup = closeLessonPopup;
