// Sample subjects - replace with your actual subjects

import { getCurrentUser } from "../../api/auth.js";
import { getChoice, getChoicesByUserId, postChoice } from "../../api/choise.js";
import { getUserSetting } from "../../api/settigns.js";
import { getView, getViewWithCustomChoice } from "../../api/view.js";
import { getMonday } from "../../utils/utils.js";
let user;
let choiceID;
let userClass;
async function getRelevantSubjects(userClass) {

    const currentLessons = (await getViewWithCustomChoice(dateToString(getMonday()), 21, {userClass:[]})).Untis
    // const currentLessons = localStorage.getItem('lessons');
    console.log(currentLessons);
    if (!currentLessons) return [];

    // const lessons = JSON.parse(currentLessons);
    const subjects = currentLessons.flatMap(lesson => lesson.subjects);

    // Duplikate entfernen
    const seenIds = new Set(subjects);

    return seenIds;
}

// Initialize by adding all subjects to visible box
const visibleBox = document.getElementById("visible-subjects");
const hiddenBox = document.getElementById("hidden-subjects");


function createSubjectElement(subject, classID) {
    const div = document.createElement("div");
    div.className = "subject-item";
    div.draggable = true;

    div.setAttribute("sid", subject.id);
    div.setAttribute("classID", classID);

    const subjectText = document.createElement("span");
    subjectText.textContent = subject.name;
    subjectText.setAttribute("sid", subject.id);
    div.appendChild(subjectText);

    const moveButton = document.createElement("button");
    moveButton.className = "move-button";

    // Set button text based on parent container
    const updateButtonText = () => {
        const isInVisible = div.closest("#visible-subjects") !== null;
        moveButton.textContent = isInVisible ? "Hide →" : "← Show";
    };

    moveButton.addEventListener("click", () => {
        const isInVisible = div.closest("#visible-subjects") !== null;
        const targetBox = isInVisible ? hiddenBox : visibleBox;
        targetBox.appendChild(div);
        updateButtonText();
        saveSettings();
    });

    div.addEventListener("dragstart", (e) => {
        div.classList.add("dragging");
    });

    div.addEventListener("dragend", (e) => {
        div.classList.remove("dragging");
        updateButtonText();
    });

    div.appendChild(moveButton);
    updateButtonText();
    localStorage.removeItem("lessons")
    return div;
}

// Add drag and drop listeners to boxes
[visibleBox, hiddenBox].forEach((box) => {
    box.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    box.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        if (draggingItem && !box.contains(draggingItem)) {
            box.appendChild(draggingItem);
            saveSettings();
        }
    });
});

function saveSettings() {
    if (!user || !choiceID) return;

    const visibleSubjects = [...visibleBox.querySelectorAll(".subject-item")].map(item => ({
        id: Number(item.getAttribute("sid")),
        classId: item.getAttribute("classId")
    }));

    const hiddenSubjects = [...hiddenBox.querySelectorAll(".subject-item")].map(item => ({
        id: Number(item.getAttribute("sid")),
        classId: item.getAttribute("classId")
    }));

    // Build Choice object with unique IDs
    const choiceObj = {};

    // Helper function to add IDs uniquely
    const addUnique = (classId, id) => {
        if (!choiceObj[classId]) choiceObj[classId] = [];
        if (!choiceObj[classId].includes(id)) {
            choiceObj[classId].push(id);
        }
    };

    visibleSubjects.forEach(sub => addUnique(sub.classId, sub.id));
    hiddenSubjects.forEach(sub => addUnique(sub.classId, -sub.id));

    // Save locally (optional)
    localStorage.setItem("visibleSubjects", JSON.stringify([...new Set(visibleSubjects.map(s => s.id))]));
    localStorage.setItem("hiddenSubjects", JSON.stringify([...new Set(hiddenSubjects.map(s => s.id))]));

    console.log({ Choice: choiceObj, id: choiceID, userId: user.id });

    // Post to API
    postChoice(user.id, choiceID, { Choice: choiceObj, id: choiceID, userId: user.id })
        .then(res => {
            if (res.status === 200) console.log("Choice saved!");
            else console.warn("Failed to save choice:", res.message);
        })
        .catch(err => console.error("Error saving choice:", err));
}


// Load saved settings on page load
async function loadSettings() {
    user = await getCurrentUser();
    choiceID = user.defaultChoice.id;
    let allSubjects = localStorage.getItem("subjects");
    userClass = await getUserSetting("untis","classId")
    if (userClass.status == 200){
        userClass = userClass.data;
    }else{
        userClass = -1;
    }
    if (allSubjects) {
        allSubjects = JSON.parse(allSubjects); // jetzt ein Array von Objekten
    } else {
        allSubjects = []; // Fallback falls nichts gespeichert
    }


    let choices = await getChoicesByUserId(user.id)
    let relevantSubjects = await getRelevantSubjects(userClass);

    console.log(relevantSubjects, choices, user, allSubjects)

    let choice = choices.data.find(choice => choice.id === choiceID);
    console.log(choice)

    let addedSubjects = [];
    for (const [classId, subjects] of Object.entries(choice.Choice)) {
        console.log("Class:", classId, "Subjects:", subjects);
        subjects.forEach(subjectID => {
            let hidden = false;
            if (subjectID < 0) {
                subjectID = -subjectID
                hidden = true;
            }
            addedSubjects.push(subjectID)
            let element = createSubjectElement(allSubjects.find(subject => subject.id === subjectID), classId)

            if (hidden) {
                hiddenBox.appendChild(element);
                element.querySelector(".move-button").textContent = "← Show";
            } else {
                visibleBox.appendChild(element);
                element.querySelector(".move-button").textContent = "Hide →";
            }
        })
    }

    relevantSubjects.forEach((subjectID) => {
        if (!addedSubjects.some(subj => subj === subjectID)) {
            const subjectElement = createSubjectElement(allSubjects.find(subject => subject.id === subjectID), userClass);
            visibleBox.appendChild(subjectElement);
            subjectElement.querySelector(".move-button").textContent = "Hide →";

        } else {
            // element = visibleBox.querySelector(".subject-item:has([sid=\"28\"])");
        }

    });
    return
}

// Load saved settings when page loads
loadSettings();
