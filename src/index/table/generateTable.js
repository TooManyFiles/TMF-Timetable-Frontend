import { createClassContainer, createTeacherContainer, createRoomContainer, createSubjectContainer } from "./dataContainer.js";

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
    // Use the helper functions to generate each section
    const subjectContainer = createSubjectContainer(lesson.subjects, lesson.originalSubjects);
    container.appendChild(subjectContainer);

    const roomContainer = createRoomContainer(lesson.rooms, lesson.originalRooms);
    container.appendChild(roomContainer);

    const teacherContainer = createTeacherContainer(lesson.teachers, lesson.originalTeachers);
    container.appendChild(teacherContainer);

    const classContainer = createClassContainer(lesson.classes, lesson.originalClasses);
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
    const days = ['m', 't', 'w', 'th', 'f']
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
                    let nextCellData = data.find(item => item.row === row + 1 && item.day === day && item.value === cellData.value);
                    let SimultaneousLessons = cellsData.length
                    if (nextCellData) {
                        let rowspan = 1;
                        SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                        // calc how many rows to merge (find consecutive same subjects)
                        while (nextCellData = data.find(item => item.row === row + rowspan && item.day === day && item.value === cellData.value)) {
                            SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                            rowspan++;
                            alreadyDrawn.push(nextCellData.id)
                        }
                        td.rowSpan = rowspan; // set rowspan for merging cells
                    }
                    td.colSpan = 1;
                    (maxSimultaneousLessonsPerDay[day] / cellsData.length)
                }
                tr.appendChild(td);
            });
            if ((maxSimultaneousLessonsPerDay[day] - cellsData.length) > 0) {
                const td = document.createElement('td');
                td.id = `${day}${row}`; // optional id (probably won't need that)
                td.colSpan = maxSimultaneousLessonsPerDay[day] - cellsData.length
                tr.appendChild(td);

            }
        });

        // append row to the table body
        dummyScheduleBody.appendChild(tr);
        dummyScheduleBody.appendChild(tr);
    }
    const scheduleBody = document.getElementById("scheduleBody");
    scheduleBody.innerHTML = dummyScheduleBody.innerHTML;
}

generateSchedule()