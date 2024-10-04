function generateLessonPopup(id) {
    // Retrieve the lessons from local storage (or wherever your data is stored)
    const lessons = JSON.parse(localStorage.getItem('lessons')) || [];

    // Find the lesson by ID
    const lesson = lessons.find(lesson => lesson.id === id);

    // Check if the lesson was found
    if (lesson) {
        // Display the relevant data in the popup
        let popup = document.getElementById('lesson-popup')
        popupContent = popup.getElementsByClassName("popup-content")[0]

        const existingPTags = popupContent.querySelectorAll('p, div');
        existingPTags.forEach(p => p.remove());

        // Subject and Time
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('popup-centered');

        const subjectHeading = document.createElement('h2');
        subjectHeading.id = 'subject';
        subjectHeading.textContent = lesson.subjects ? lesson.subjects.map(s=>s.name).join(", ") : "Sonderstunde";
        subjectDiv.appendChild(subjectHeading);

        const divider = document.createElement('hr');
        divider.classList.add('popup-divider');
        subjectDiv.appendChild(divider);

        const timePara = document.createElement('p');
        timePara.id = 'time';
        timePara.textContent = `${window.timeToReadable(lesson.startTime)} - ${window.timeToReadable(lesson.endTime)}`;//TODO: wrong endTime when combined
        subjectDiv.appendChild(timePara);

        popupContent.appendChild(subjectDiv);

        // Helper function to create a label and value pair
        function createField(labelText, fieldId, fieldValue) {
            const fieldPara = document.createElement('p');
            const label = document.createElement('strong');
            label.textContent = `${labelText}: `;
            fieldPara.appendChild(label);

            const valueSpan = document.createElement('span');
            valueSpan.id = fieldId;
            valueSpan.textContent = fieldValue || "";
            fieldPara.appendChild(valueSpan);

            return fieldPara;
        }

        // Generate all fields dynamically
        popupContent.appendChild(createField("Lehrkraft", "teacher", lesson.teachers ? lesson.teachers.map(t=>t.name).join(", ") : ""));
        popupContent.appendChild(createField("Raum", "room", lesson.rooms ? lesson.rooms.map(r=>r.name).join(", ") : ""));
        popupContent.appendChild(createField("Klasse", "info", lesson.classes ? lesson.classes.map(c=>c.name).join(", ") : ""));
        popupContent.appendChild(createField("Info", "info", lesson.additionalInformation));

        popupContent.appendChild(createField("Cancelled", "cancelled", lesson.cancelled ? "Yes" : ""));
        popupContent.appendChild(createField("Irregular", "irregular", lesson.irregular ? "Yes" : ""));
        popupContent.appendChild(createField("Substitution Text", "substitutionText", lesson.substitutionText));
        popupContent.appendChild(createField("Lesson Text", "lessonText", lesson.lessonText));
        popupContent.appendChild(createField("Booking Text", "bookingText", lesson.bookingText));
        popupContent.appendChild(createField("Homework", "homework", lesson.homework));
        popupContent.appendChild(createField("Last Update", "lastUpdate", window.dateAndTimeToReadable(lesson.lastUpdate)));
        popupContent.appendChild(createField("Chair Up", "chairUp", lesson.chairUp ? "Yes" : ""));


        // Display the popup
        document.getElementById('lesson-popup').style.display = 'flex';
    }
}

function closeLessonPopup() {
    document.getElementById('lesson-popup').style.display = 'none';
}


// CAFE POPUP
function generateCafePopup(date, main_dish, vegetarian_dish, salad, desert, cooking_team) {
    document.getElementById('date').textContent = date;
    document.getElementById('main_dish').textContent = main_dish;
    document.getElementById('vegetarian_dish').textContent = vegetarian_dish;
    document.getElementById('salad').textContent = salad;
    document.getElementById('desert').textContent = desert;
    document.getElementById('cooking_team').textContent = cooking_team;
    document.getElementById('cafe-popup').style.display = 'flex';
}

function closeCafePopup() {
    document.getElementById('cafe-popup').style.display = 'none';
}

document.getElementById('lesson-popup').addEventListener('click', function () {
    closeLessonPopup();
});
document.getElementById('cafe-popup').addEventListener('click', function () {
    closeCafePopup();
});