// TODO: also add the functions of time control here (arrow left & arrow right)
import { datestringToReadableSHORT, getFriday, getMonday, switchWeek, getKW } from "../utils/utils.js";

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


function updateURL(monday) {
    const { kw, year } = getKW(monday);
    const params = new URLSearchParams(window.location.search);
    params.set("kw", kw);
    params.set("year", year);
    history.replaceState(null, "", "?" + params.toString());
}

function updateTopbarAndURL() {
    setTopbarDate(datestringToReadableSHORT(getMonday()), datestringToReadableSHORT(getFriday()));
    updateURL(getMonday());
}

// Buttons
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".timerange-controls");

    if (buttons.length >= 2) {
        // zurück
        buttons[0].addEventListener("click", () => {
            switchWeek(-1);
            updateTopbarAndURL();
        });
        // vor
        buttons[1].addEventListener("click", () => {
            switchWeek(1);
            updateTopbarAndURL();
        });
    }
});

export function updateTopbarDate() {
    setTopbarDate(datestringToReadableSHORT(getMonday()), datestringToReadableSHORT(getFriday()));
}

window.updateTopbarDate = updateTopbarDate;
