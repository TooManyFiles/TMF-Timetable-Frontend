const scheduleData = [
    { row: 1, day: 'm', value: 'G, An, 210', cancelled: '' },
    { row: 2, day: 'm', value: 'G, An, 210', cancelled: '' },
    { row: 3, day: 'm', value: 'G, Bk, 222', cancelled: 'True' },
    { row: 4, day: 'm', value: 'G, Bk, 222', cancelled: 'True' },
    { row: 5, day: 'm', value: 'D, Ge, 324', cancelled: '' },
    { row: 8, day: 'm', value: 'E, Sch, 320', cancelled: '' },
    { row: 9, day: 'm', value: 'M, Ei, 312', cancelled: '' },
    { row: 1, day: 't', value: 'G, An, 210', cancelled: 'True' },
    { row: 3, day: 'w', value: 'G, An, 210', cancelled: '' },
    { row: 5, day: 'w', value: 'D, Ge, 324', cancelled: 'True' },
    { row: 6, day: 'w', value: 'D, Ge, 324', cancelled: '' },
    { row: 7, day: 'w', value: 'D, Ge, 324', cancelled: '' },
    { row: 4, day: 'th', value: 'G, An, 210', cancelled: '' },
    { row: 5, day: 'f', value: 'G, An, 210', cancelled: '' },
];

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
                td.textContent = cellData.value;
                // Style
                td.style.backgroundColor = 'var(--table-highlight)';
                td.style.borderRadius = '10px';

                // check if cancelled
                if (cellData.cancelled === 'True') {
                    // apply the stylle for cancelled cells
                    td.style.backgroundColor = 'var(--table-highlight-faded)';
                    td.style.color = 'var(--text-faded)';
                    td.style.fontStyle = 'italic'; 

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
