// TODO: also add the functions of time control here (arrow left & arrow right)

function setTopbarDate(sdate, edate) {
    let start = document.getElementById('startdate');
    let end = document.getElementById('enddate');

    if (start && end) {
        start.textContent = sdate;
        end.textContent = edate;  // Example static end date (you can change it dynamically)
    } else {
        console.error('Start or End date elements are not found.');
    }
}

window.setTopbarDate = setTopbarDate;
