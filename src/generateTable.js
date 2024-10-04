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

// scheduleData = lessons;

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


function generateSchedule(data) {
    const scheduleBody = document.getElementById("scheduleBody");
    // find highest row number in the data (--> latest session) to know how many rows to create
    const maxRow = Math.max(...data.map(item => item.row));

    // keep track on how many lessons to merge on each day
    const rowspanMap = {
        'm': 0,
        't': 0,
        'w': 0,
        'th': 0,
        'f': 0
    };

    for (let row = 1; row <= maxRow; row++) {
        const tr = document.createElement('tr');
        // first cell = lesson number
        const tdNumber = document.createElement('td');
        tdNumber.textContent = row;
        tr.appendChild(tdNumber);

        ['m', 't', 'w', 'th', 'f'].forEach(day => {
            const cellData = data.find(item => item.row === row && item.day === day);
            // if in the middle of a rowspan, skip creating a new cell for that day
            if (rowspanMap[day] > 0) {
                rowspanMap[day]--;
                return;
            }

            const td = document.createElement('td');
            td.id = `${day}${row}`; // optional id (probably won't need that)

            if (cellData) {
                td.appendChild(generateLessonTableContent(cellData));
                td.setAttribute("lessonid", cellData.id)
                if (cellData.irregular){
                    td.classList.add("irregular")
                }
                if (cellData.cancelled){
                    
                }
                if (cellData.chairUp){
                    td.classList.add("chairUp")
                }
                td.onclick = () => generateLessonPopup(cellData.id);
                td.style.cursor = 'pointer';
                td.style.backgroundColor = 'var(--table-highlight)';
                td.style.borderRadius = '10px';

                // check if cancelled
                if (cellData.cancelled) {
                    td.classList.add("cancelled")

                    // add the diagonal red line:
                    setTimeout(() => {

                        // rm existing lined if there are ayny
                        const existingLine = td.querySelector('.diagonal-line');
                        if (existingLine) {
                            existingLine.remove();
                        }
                        const width = td.offsetWidth;
                        const height = td.offsetHeight;
                        // calc the angle
                        const angle = Math.atan(height / width) * (180 / Math.PI);
                        // create the line element
                        const line = document.createElement('div');
                        line.classList.add('diagonal-line');
                        line.style.position = 'absolute';
                        line.style.top = '0';
                        line.style.left = '0';
                        line.style.width = '999%';
                        line.style.height = '100%';
                        line.style.borderTop = '2px solid red';
                        line.style.transform = `rotate(${angle}deg)`;
                        line.style.transformOrigin = 'top left';

                        td.appendChild(line);
                    }, 0);
                }

                // check if next row has the same subject
                const nextCellData = data.find(item => item.row === row + 1 && item.day === day);
                if (nextCellData && nextCellData.value === cellData.value && nextCellData.cancelled === cellData.cancelled) {
                    let rowspan = 1;

                    // calc how many rows to merge (find consecutive same subjects)
                    while (data.find(item => item.row === row + rowspan && item.day === day && item.value === cellData.value)) {
                        rowspan++;
                    }

                    td.rowSpan = rowspan; // set rowspan for merging cells
                    rowspanMap[day] = rowspan - 1; // Skip following rows for this day
                }
            }

            tr.appendChild(td);
        });

        // append row to the table body
        scheduleBody.appendChild(tr);
    }
}

// recalculate diagonal lines on window resize
window.addEventListener('resize', () => {
    const cancelledCells = document.querySelectorAll('td .diagonal-line');
    cancelledCells.forEach(line => {
        const td = line.parentElement;
        line.remove(); // rm old line
        setTimeout(() => {
            const width = td.offsetWidth;
            const height = td.offsetHeight;
            const angle = Math.atan(height / width) * (180 / Math.PI);

            const newLine = document.createElement('div');
            newLine.classList.add('diagonal-line');
            newLine.style.position = 'absolute';
            newLine.style.top = '0';
            newLine.style.left = '0';
            newLine.style.width = '999%';
            newLine.style.height = '100%';
            newLine.style.borderTop = '2px solid red';
            newLine.style.transform = `rotate(${angle}deg)`;
            newLine.style.transformOrigin = 'top left';

            td.appendChild(newLine);
        }, 0);
    });
});


generateSchedule(scheduleData);
