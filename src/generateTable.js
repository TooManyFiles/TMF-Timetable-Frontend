const scheduleData = [
    //mon
    { row: 1, day: 'm', value: 'rev2, Fi, 314', cancelled: '' },
    { row: 2, day: 'm', value: 'rev2, Fi, 314', cancelled: '' },
    { row: 3, day: 'm', value: 'E1, Rs, 323', cancelled: '' },
    { row: 4, day: 'm', value: 'E1, Rs, 323', cancelled: '' },
    { row: 8, day: 'm', value: 'mu1, Hz, 422', cancelled: '' },
    { row: 9, day: 'm', value: 'mu1, Hz, 422', cancelled: '' },
    //tue
    { row: 1, day: 't', value: 'D2, Rt, 414', cancelled: '' },
    { row: 2, day: 't', value: 'D2, Rt, 414', cancelled: '' },
    { row: 3, day: 't', value: 'ph1, Hr, 424', cancelled: '' },
    { row: 4, day: 't', value: 'ph1, Hr, 424', cancelled: '' },
    { row: 5, day: 't', value: 'f1, Kth, 422', cancelled: '' },
    { row: 6, day: 't', value: 'f1, Kth, 422', cancelled: '' },
    { row: 10, day: 't', value: 's3, Er, SHA', cancelled: '' },
    { row: 11, day: 't', value: 's3, Er, SHA', cancelled: '' },
    //at the same time:
    { row: 10, day: 't', value: 's2, Dt, HG SH 1', cancelled: '' },
    { row: 11, day: 't', value: 's3, Dt, HG SH 1', cancelled: '' },
    //--
    //wed
    { row: 2, day: 'w', value: 'm2, Pl, 321', cancelled: '' },
    { row: 3, day: 'w', value: 'geo4, Lk, 414', cancelled: '' },
    { row: 4, day: 'w', value: 'geo4, Lk, 414', cancelled: '' },
    { row: 5, day: 'w', value: 'G1, An, 324', cancelled: '' },
    { row: 6, day: 'w', value: 'G1, An, 324', cancelled: '' },
    { row: 7, day: 'w', value: 'G1, An, 324', cancelled: '' },
    { row: 9, day: 'w', value: 'E1, Rs, 323', cancelled: '' },
    { row: 10, day: 'w', value: 'E1, Rs, 323', cancelled: '' },
    //thur
    { row: 1, day: 'th', value: 'G1, An, 321', cancelled: '' },
    { row: 2, day: 'th', value: 'G1, An, 321', cancelled: '' },
    { row: 3, day: 'th', value: 'D2, Rt, 323', cancelled: '' },
    { row: 4, day: 'th', value: 'D2, Rt, 323', cancelled: '' },
    { row: 5, day: 'th', value: 'f1, Kth, 113', cancelled: '' },
    { row: 8, day: 'th', value: 'inf, Hr, 423', cancelled: '' },
    { row: 9, day: 'th', value: 'inf, Hr, 423', cancelled: '' },
    //fri
    { row: 3, day: 'f', value: 'm2, Pl, 121', cancelled: '' },
    { row: 4, day: 'f', value: 'm2, Pl, 121', cancelled: '' },
    { row: 5, day: 'f', value: 'E1, Rs, 322', cancelled: 'True' },
    { row: 6, day: 'f', value: 'D2, Rt, 312', cancelled: 'True' },
    { row: 7, day: 'f', value: 'lth, Sch, 410', cancelled: 'True' },
    { row: 8, day: 'f', value: 'lth, Sch, 410', cancelled: 'True' },
    
];

function generateSchedule(data) {
    const scheduleBody = document.getElementById("scheduleBody");
    const maxRow = Math.max(...data.map(item => item.row));

    const rowspanMap = {
        'm': 0,
        't': 0,
        'w': 0,
        'th': 0,
        'f': 0
    };

    for (let row = 1; row <= maxRow; row++) {
        const tr = document.createElement('tr');
        const tdNumber = document.createElement('td');
        tdNumber.textContent = row;
        tr.appendChild(tdNumber);

        ['m', 't', 'w', 'th', 'f'].forEach(day => {
            const lessons = data.filter(item => item.row === row && item.day === day);

            // if rowspan in progress skip
            if (rowspanMap[day] > 0) {
                rowspanMap[day]--;
                return;
            }

            if (lessons.length === 1) {
                const td = document.createElement('td');
                td.id = `${day}${row}`;
                td.textContent = lessons[0].value;
                styleLessonCell(td, lessons[0]);
                applyRowSpan(lessons[0], td, day, row, data, rowspanMap);
                tr.appendChild(td);
            } else if (lessons.length === 2) {
                const tdWrapper = document.createElement('td');
                tdWrapper.style.display = 'flex'; 
                tdWrapper.style.padding = '0';   
                tdWrapper.colSpan = 1;            
                
                const td1 = document.createElement('div');
                td1.style.width = '50%';
                td1.style.boxSizing = 'border-box';
                td1.textContent = lessons[0].value;
                styleLessonCell(td1, lessons[0]);

                const td2 = document.createElement('div');
                td2.style.width = '50%';
                td2.style.boxSizing = 'border-box';
                td2.textContent = lessons[1].value;
                styleLessonCell(td2, lessons[1]);
                tdWrapper.appendChild(td1);
                tdWrapper.appendChild(td2);
                tr.appendChild(tdWrapper);
            }
        });

        scheduleBody.appendChild(tr);
    }
}

function styleLessonCell(td, cellData) {
    td.style.backgroundColor = 'var(--table-highlight)';
    td.style.borderRadius = '10px';
    td.style.padding = '10px';
    td.style.margin = '0';
    td.style.boxSizing = 'border-box';

    if (cellData.cancelled === 'True') {
        td.style.backgroundColor = 'var(--table-highlight-faded)';
        td.style.color = 'var(--text-faded)';
        td.style.fontStyle = 'italic';
        // diagonal linr
        setTimeout(() => {
            const width = td.offsetWidth;
            const height = td.offsetHeight;
            const angle = Math.atan(height / width) * (180 / Math.PI);
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
}

function applyRowSpan(lesson, td, day, row, data, rowspanMap) {
    const nextLesson = data.find(item => item.row === row + 1 && item.day === day && item.value === lesson.value && item.cancelled === lesson.cancelled);
    if (nextLesson) {
        let rowspan = 1;
        while (data.find(item => item.row === row + rowspan && item.day === day && item.value === lesson.value && item.cancelled === lesson.cancelled)) {
            rowspan++;
        }
        td.rowSpan = rowspan; 
        rowspanMap[day] = rowspan - 1;
    }
}

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
})

generateSchedule(scheduleData);
