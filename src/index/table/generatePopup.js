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
        subjectHeading.textContent = lesson.subjects ? lesson.subjects.map(s => s.name).join(", ") : "Sonderstunde";
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

        // Create the teacher container
        const teacherContainer = document.createElement('span');
        teacherContainer.classList.add('lesson-teacher');
        if (lesson.teachers && lesson.teachers.length) {
            lesson.teachers.forEach(teacher => {
                const teacherItem = document.createElement('span');

                const teacherItemPronoun = document.createElement('span');
                teacherItemPronoun.classList.add('pronoun');
                teacherItemPronoun.textContent = teacher.pronoun;
                teacherItem.appendChild(teacherItemPronoun);
                const teacherItemTitle = document.createElement('span');
                teacherItemTitle.classList.add('title');
                teacherItemTitle.textContent = teacher.title;
                teacherItem.appendChild(teacherItemTitle);
                const teacherItemForename = document.createElement('span');
                teacherItemForename.classList.add('forename');
                teacherItemForename.textContent = teacher.firstName;
                teacherItem.appendChild(teacherItemForename);
                const teacherItemLong = document.createElement('span');
                teacherItemLong.classList.add('long');
                teacherItemLong.textContent = teacher.name;
                teacherItem.appendChild(teacherItemLong);
                const teacherItemShort = document.createElement('span');
                teacherItemShort.classList.add('short');
                teacherItemShort.textContent = teacher.shortName;
                teacherItem.appendChild(teacherItemShort);

                teacherContainer.appendChild(teacherItem);
            });
        }
        if (lesson.originalTeachers && lesson.originalTeachers.length) {
            lesson.originalTeachers.forEach(teacher => {
                const teacherItem = document.createElement('span');

                const teacherItemPronoun = document.createElement('span');
                teacherItemPronoun.classList.add('pronoun');
                teacherItemPronoun.textContent = teacher.pronoun;
                teacherItem.appendChild(teacherItemPronoun);
                const teacherItemTitle = document.createElement('span');
                teacherItemTitle.classList.add('title');
                teacherItemTitle.textContent = teacher.title;
                teacherItem.appendChild(teacherItemTitle);
                const teacherItemForename = document.createElement('span');
                teacherItemForename.classList.add('forename');
                teacherItemForename.textContent = teacher.firstName;
                teacherItem.appendChild(teacherItemForename);
                const teacherItemLong = document.createElement('span');
                teacherItemLong.classList.add('long');
                teacherItemLong.textContent = teacher.name;
                teacherItem.appendChild(teacherItemLong);
                const teacherItemShort = document.createElement('span');
                teacherItemShort.classList.add('short');
                teacherItemShort.textContent = teacher.shortName;
                teacherItem.appendChild(teacherItemShort);

                teacherItem.classList.add('originalData');
                teacherContainer.appendChild(teacherItem);
            });
        }
        popupContent.appendChild(createField("Lehrkraft", "teacher", teacherContainer));

        // Create the room container
        const roomContainer = document.createElement('span');
        roomContainer.classList.add('lesson-room');
        if (lesson.rooms && lesson.rooms.length) {
            lesson.rooms.forEach(room => {
                const roomItem = document.createElement('span');

                const roomItemName = document.createElement('span');
                roomItemName.classList.add('name');
                roomItemName.textContent = room.name;
                roomItem.appendChild(roomItemName);
                const roomItemAddInfo = document.createElement('span');
                roomItemAddInfo.classList.add('info');
                roomItemAddInfo.textContent = room.additionalInformation;

                roomItem.appendChild(roomItemAddInfo);
                roomContainer.appendChild(roomItem);
            });
        }
        if (lesson.originalRooms && lesson.originalRooms.length) {
            lesson.originalRooms.forEach(room => {
                const roomItem = document.createElement('span');

                const roomItemName = document.createElement('span');
                roomItemName.classList.add('name');
                roomItemName.textContent = room.name;
                roomItem.appendChild(roomItemName);
                const roomItemAddInfo = document.createElement('span');
                roomItemAddInfo.classList.add('info');
                roomItemAddInfo.textContent = room.additionalInformation;
                roomItem.appendChild(roomItemAddInfo);

                roomItem.classList.add('originalData');
                roomContainer.appendChild(roomItem);
            });
        }
        popupContent.appendChild(createField("Raum", "room", roomContainer));

        // Create the class container
        const classContainer = document.createElement('span');
        classContainer.classList.add('lesson-class');
        if (lesson.classes && lesson.classes.length) {
            lesson.classes.forEach(_class => {
                const classItem = document.createElement('span');
                classItem.textContent = _class.name;
                classContainer.appendChild(classItem);
            });
        }
        if (lesson.originalClasses && lesson.originalClasses.length) {
            lesson.originalClasses.forEach(_class => {
                const classItem = document.createElement('span');
                classItem.classList.add('originalData');
                classItem.textContent = _class.name;
                classContainer.appendChild(classItem);
            });
        }
        popupContent.appendChild(createField("Klasse", "classes", classContainer));

        popupContent.appendChild(createField("Info", "info", lesson.additionalInformation));
        popupContent.appendChild(createField("Entfall", "cancelled", lesson.cancelled ? "Ja" : ""));
        popupContent.appendChild(createField("Irregulär", "irregular", lesson.irregular ? "Ja" : ""));
        popupContent.appendChild(createField("Vertretungsinfo", "substitutionText", lesson.substitutionText));
        popupContent.appendChild(createField("Stundeninfo", "lessonText", lesson.lessonText));
        popupContent.appendChild(createField("Buchungsinfo", "bookingText", lesson.bookingText));
        popupContent.appendChild(createField("Hausaufgaben", "homework", lesson.homework));
        popupContent.appendChild(createField("Aufstuhlen", "chairUp", lesson.chairUp ? "Ja" : ""));
        popupContent.appendChild(createField("Letztes update", "lastUpdate", window.dateAndTimeToReadable(lesson.lastUpdate)));
        

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