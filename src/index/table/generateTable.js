function generateSchedule() {
    let lessons = localStorage.getItem('lessons');
    lessons = JSON.parse(lessons);
    // Get the start (Monday) and end (Friday) of the current week
    let startOfWeek = window.getMonday();
    const endOfWeek = window.getFriday().setHours(24, 59, 59, 0); // Set to midnight (24, 59, 59, 0)

    // Filter lessons based on the startTime
    let scheduleData = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.startTime); // Assuming startDate is in a format compatible with Date constructor
        return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
    });
    generateScheduleTable(scheduleData);
}


function generateLessonTableContent(lesson) {
    const container = document.createElement('div');
    container.classList.add('lesson-grid-container');

    // Create the subject container
    const subjectContainer = document.createElement('span');
    subjectContainer.classList.add('lesson-subject');
    if (lesson.subjects && lesson.subjects.length) {
        lesson.subjects.forEach(subject => {
            const subjectItem = document.createElement('span');
            subjectItem.textContent = subject.name;
            subjectContainer.appendChild(subjectItem);
        });
    }
    container.appendChild(subjectContainer);

    // Create the room container
    const roomContainer = document.createElement('span');
    roomContainer.classList.add('lesson-room');
    if (lesson.rooms && lesson.rooms.length) {
        lesson.rooms.forEach(room => {
            const roomItem = document.createElement('span');
            roomItem.textContent = room.name;
            roomContainer.appendChild(roomItem);
        });
    }
    container.appendChild(roomContainer);

    // Create the teacher container
    const teacherContainer = document.createElement('span');
    teacherContainer.classList.add('lesson-teacher');
    if (lesson.teachers && lesson.teachers.length) {
        lesson.teachers.forEach(teacher => {
            const teacherItem = document.createElement('span');
            teacherItem.textContent = teacher.name;
            teacherContainer.appendChild(teacherItem);
        });
    }
    container.appendChild(teacherContainer);

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
    container.appendChild(classContainer);

    // Add additional properties
    const additionalInfo = {
        additionalInformation: lesson.additionalInformation || '',
        substitutionText: lesson.substitutionText || '',
        lessonText: lesson.lessonText || '',
        bookingText: lesson.bookingText || '',
        // chairUp: lesson.chairUp || ''
    };

    // Create the class container
    const infoContainer = document.createElement('span');
    infoContainer.classList.add('lesson-addInfo');
    for (const [key, value] of Object.entries(additionalInfo)) {
        if (value) { // Only add if value is not empty
            const infoSubContainer = document.createElement('span');
            infoSubContainer.classList.add(`lesson-${key}`);
            infoSubContainer.textContent = value;
            infoContainer.appendChild(infoSubContainer);
        }
    }
    container.appendChild(infoContainer);

    return container;
}
function updateColspan(columns) {
    days = ['m', 't', 'w', 'th', 'f']
    const thElements = document.querySelectorAll('#schedule th:not(:first-child)');
    thElements.forEach((th, index) => {
        th.colSpan = columns[days[index % 5]];
    });

}
function getMaxSimultaneousLessonsPerDay(data) {
    const countMap = {};
    const maxCount = {};

    data.forEach(item => {
        // Initialize countMap for each day if not already initialized
        if (!countMap[item.day]) {
            countMap[item.day] = {};
        }

        // Initialize the row count for each day if not already initialized
        countMap[item.day][item.row] = (countMap[item.day][item.row] || 0) + 1;

        // Initialize maxCount for each day if not already initialized
        if (!maxCount[item.day]) {
            maxCount[item.day] = 1;
        }

        // Update maxCount for the current day
        maxCount[item.day] = Math.max(maxCount[item.day], countMap[item.day][item.row]);
    });

    return maxCount;
}
function generateScheduleTable(data) {
    const dummyScheduleBody = document.createElement('tbody');
    // find highest row number in the data (--> latest session) to know how many rows to create
    const maxRow = Math.max(...data.map(item => item.row));

    const maxSimultaneousLessonsPerDay = getMaxSimultaneousLessonsPerDay(data)
    updateColspan(maxSimultaneousLessonsPerDay)

    // keep track on witch lessons already have been drawn as a combination
    let alreadyDrawn = []

    for (let row = 1; row <= maxRow; row++) {
        const tr = document.createElement('tr');
        // first cell = lesson number
        const tdNumber = document.createElement('td');
        tdNumber.textContent = row;
        tr.appendChild(tdNumber);

        ['m', 't', 'w', 'th', 'f'].forEach(day => {
            const cellsData = data.filter(item => item.row === row && item.day === day);
            if (cellsData.length == 0) {
                const td = document.createElement('td');
                td.id = `${day}${row}`; // optional id (probably won't need that)
                td.colSpan = maxSimultaneousLessonsPerDay[day] - cellsData.length
                tr.appendChild(td);
            }
            cellsData.forEach(cellData => {
                if (alreadyDrawn.includes(cellData.id)) {
                    return
                }

                const td = document.createElement('td');
                td.id = `${day}${row}`; // optional id (probably won't need that)

                if (cellData) {
                    const lessonContainer = generateLessonTableContent(cellData);
                    td.appendChild(lessonContainer);
                    lessonContainer.setAttribute("lessonid", cellData.id)
                    if (cellData.irregular) {
                        lessonContainer.classList.add("irregular")
                    }
                    if (cellData.chairUp) {
                        lessonContainer.classList.add("chairUp")
                    }
                    // check if cancelled
                    if (cellData.cancelled) {
                        lessonContainer.classList.add("cancelled")
                    }
                    lessonContainer.style.cursor = 'pointer';
                    lessonContainer.style.backgroundColor = 'var(--table-highlight)';
                    lessonContainer.style.borderRadius = '10px';


                    // check if next row has the same subject
                    const nextCellData = data.find(item => item.row === row + 1 && item.day === day && item.value === cellData.value);
                    let SimultaneousLessons = cellsData.length
                    if (nextCellData) {
                        let rowspan = 1;
                        SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                        // calc how many rows to merge (find consecutive same subjects)
                        while (next = data.find(item => item.row === row + rowspan && item.day === day && item.value === cellData.value)) {
                            SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                            rowspan++;
                            alreadyDrawn.push(next.id)
                        }
                        td.rowSpan = rowspan; // set rowspan for merging cells
                        for (let index = 0; index < SimultaneousLessons - cellsData.length; index++) {
                            const td = document.createElement('td');
                            td.id = `${day}${row}`; // optional id (probably won't need that)
                            td.colSpan = maxSimultaneousLessonsPerDay[day] - cellsData.length
                            tr.appendChild(td);

                        }
                    }
                    td.colSpan = maxSimultaneousLessonsPerDay[day] - SimultaneousLessons + 1

                }

                tr.appendChild(td);
            });
        });

        // append row to the table body
        dummyScheduleBody.appendChild(tr);
    }
    const scheduleBody = document.getElementById("scheduleBody");
    scheduleBody.innerHTML = dummyScheduleBody.innerHTML;
}

generateSchedule()