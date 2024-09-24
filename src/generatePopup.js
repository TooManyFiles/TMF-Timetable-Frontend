// LESSON POPUP
function generateLessonPopup(subject, time, teacher, room, info) {
    document.getElementById('subject').textContent = subject || "Sonderstunde";
    document.getElementById('time').textContent = time;
    document.getElementById('teacher').textContent = teacher || "n/a";
    document.getElementById('room').textContent = room || "n/a";
    document.getElementById('info').textContent = info || "n/a";
    document.getElementById('lesson-popup').style.display = 'flex';
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

document.getElementById('lesson-popup').addEventListener('click', function() {
    closeLessonPopup();
});
document.getElementById('cafe-popup').addEventListener('click', function() {
    closeCafePopup();
});