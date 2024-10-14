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
function gcd(a, b) {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
// Function to compute LCM of two numbers
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Function to compute LCM of an array of numbers
function lcmOfArray(arr) {
    return arr.reduce((acc, num) => lcm(acc, num), arr[0]);
}

function getLCMofAmoutOfSimultaneousLessonsPerDay(data) {
    const countMap = {};

    data.forEach(item => {
        // Initialize countMap for each day if not already initialized
        if (!countMap[item.day]) {
            countMap[item.day] = {};
        }

        // Increment the row count for each day
        countMap[item.day][item.row] = (countMap[item.day][item.row] || 0) + 1;
    });

    const lcmMap = {};

    // Calculate LCM for each day
    for (const day in countMap) {
        const rowCounts = Object.values(countMap[day]);
        if (rowCounts.length > 0) {
            lcmMap[day] = lcmOfArray(rowCounts);
        }
    }

    return lcmMap;
}
function sortTDElementsByRowSpan(tr, className) {
    // Select all <td> elements with the specific class within the given <tr>
    const tdElements = Array.from(tr.querySelectorAll(`td.${className}`));

    // Sort the elements based on the colspan attribute
    tdElements.sort((a, b) => {
        // Get the colspan values, defaulting to 1 if not set
        const colspanA = a.rowSpan;
        const colspanB = b.rowSpan;
        return colspanB - colspanA;
    });

    // Create a DocumentFragment to improve performance
    const fragment = document.createDocumentFragment();

    // Append sorted elements to the fragment
    tdElements.forEach(td => {
        tr.removeChild(td);  // Remove the element from its original position
        fragment.appendChild(td);  // Add it to the fragment in sorted order
    });

    // Append the sorted elements back to the <tr> in sorted order
    tr.appendChild(fragment);
}

function generateScheduleTable(data) {
    const dummyScheduleBody = document.createElement("tbody");
    // find highest row number in the data (--> latest session) to know how many rows to create
    const maxRow = Math.max(...data.map(item => item.row));

    const ColumnsPerDay = getLCMofAmoutOfSimultaneousLessonsPerDay(data)
    updateColspan(ColumnsPerDay)

    // keep track on witch lessons already have been drawn as a combination
    let alreadyDrawn = [];
    let previouslyTakenSpaces = {};
    ['m', 't', 'w', 'th', 'f'].forEach(day => { previouslyTakenSpaces[day] = [] });
    for (let row = 1; row <= maxRow; row++) {
        const tr = document.createElement('tr');
        // first cell = lesson number
        const tdNumber = document.createElement('td');
        tdNumber.textContent = row;
        tr.appendChild(tdNumber);
        dummyScheduleBody.appendChild(tr);
        ['m', 't', 'w', 'th', 'f'].forEach(day => {
            let takenSpaces = 0;
            const cellsData = data.filter(item => item.row === row && item.day === day);


            cellsData.forEach(cellData => {
                if (alreadyDrawn.map(lesson => (lesson.id)).includes(cellData.id)) {
                    return
                }

                const td = document.createElement('td');
                td.classList.add(`${day}${row}`); // optional id (probably won't need that)

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
                    let elementWith = (ColumnsPerDay[day] - (previouslyTakenSpaces[day][row - 1] || 0)) / (cellsData.length - (alreadyDrawn.filter(item => item.row === row && item.day === day)).length)
                    if (nextCellData) {
                        let rowspan = 1;
                        SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                        // calc how many rows to merge (find consecutive same subjects)
                        while (nextCellData = data.find(item => item.row === row + rowspan && item.day === day && item.value === cellData.value)) {
                            SimultaneousLessons = Math.max(SimultaneousLessons, data.filter(item => item.row === row + rowspan && item.day === day).length)
                            rowspan++;
                            alreadyDrawn.push(nextCellData)
                        }
                        td.rowSpan = rowspan; // set rowspan for merging cells
                        if (SimultaneousLessons != cellsData.length) {
                            elementWith = (ColumnsPerDay[day] - (previouslyTakenSpaces[day][row - 1] || 0)) / (SimultaneousLessons - (alreadyDrawn.filter(item => item.row === row && item.day === day)).length)
                        }
                        for (let index = 0; index < rowspan - 1; index++) {
                            previouslyTakenSpaces[day][row + index] = (previouslyTakenSpaces[day][row + index] || 0) + elementWith;
                        }
                    }
                    td.colSpan = elementWith;
                    takenSpaces += elementWith
                }
                tr.appendChild(td);
            });
            sortTDElementsByRowSpan(tr, `${day}${row}`)
            if ((ColumnsPerDay[day] - takenSpaces - (previouslyTakenSpaces[day][row - 1] || 0)) > 0) {
                const td = document.createElement('td');
                td.classList.add(`${day}${row}`); // optional id (probably won't need that)
                td.colSpan = ColumnsPerDay[day] - takenSpaces - (previouslyTakenSpaces[day][row - 1] || 0)
                tr.appendChild(td);
            }
        });

        // append row to the table body

    }
    const scheduleBody = document.getElementById("scheduleBody");
    scheduleBody.innerHTML = dummyScheduleBody.innerHTML;
}

window.generateSchedule = generateSchedule
let lastLessons = localStorage.getItem('lessons');
setInterval(() => {
    const currentLessons = localStorage.getItem('lessons');
    if (currentLessons !== lastLessons) {
        lastLessons = currentLessons;
        window.generateSchedule();
    }
}, 1000); // Adjust the interval as needed