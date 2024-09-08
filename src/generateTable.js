// dummy data:
const scheduleData = [
    { row: 1, day: 'm', value: 'G, An, 210' },
    { row: 2, day: 'm', value: 'G, An, 210' },
    { row: 3, day: 'm', value: 'G, Bk, 222' },
    { row: 4, day: 'm', value: 'G, Bk, 222' },
    { row: 5, day: 'm', value: 'D, Ge, 324' },
    { row: 8, day: 'm', value: 'E, Sch, 320' },
    { row: 9, day: 'm', value: 'M, Ei, 312' },
    { row: 1, day: 't', value: 'G, An, 210' },
    { row: 3, day: 'w', value: 'G, An, 210' },
    { row: 5, day: 'w', value: 'D, Ge, 324' },
    { row: 6, day: 'w', value: 'D, Ge, 324' },
    { row: 7, day: 'w', value: 'D, Ge, 324' },
    { row: 4, day: 'th', value: 'G, An, 210' },
    { row: 5, day: 'f', value: 'G, An, 210' },
];


function generateSchedule(data) {
    const scheduleBody = document.getElementById("scheduleBody");
    // find highest row number in the data (--> latest session) to knowo how much rows to create
    const maxRow = Math.max(...data.map(item => item.row));

    // keep track on how many lessons to merge on each day
    const rowspanMap = {
        'm': 0,
        't': 0,
        'w': 0,
        'th': 0,
        'f': 0
    };
    const lastTdMap = {};

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
                
                // check if next row has the same subject
                const nextCellData = data.find(item => item.row === row + 1 && item.day === day);
                if (nextCellData && nextCellData.value === cellData.value) {
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

generateSchedule(scheduleData);