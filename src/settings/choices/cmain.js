// Sample subjects - replace with your actual subjects

import { getCurrentUser } from "../../api/auth.js";
import { getStaticData } from "../../api/untis.js";
import { getChoice, getChoicesByUserId, postChoice } from "../../api/choice.js";
import { getUserSetting } from "../../api/settings.js";
import { getView, getViewWithCustomChoice } from "../../api/view.js";
import { getMonday } from "../../utils/utils.js";
let user;
let choiceID;
let userClass;


// Duration in days for lesson view
const LESSON_VIEW_DURATION_DAYS = 21;

async function getRelevantSubjects(userClass) {

    const currentLessons = (await getViewWithCustomChoice(
        dateToString(getMonday()),
        LESSON_VIEW_DURATION_DAYS,
        { ["" + userClass]: [] }
    )).Untis;

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

function highlightMoved(element) {
    element.classList.add("moved");
    setTimeout(() => {
        element.classList.remove("moved");
    }, 3000);
}


function createSubjectElement(subject, classID) {
    const div = document.createElement("div");
    div.className = "subject-item";
    div.draggable = true;

    div.setAttribute("sid", subject.id);
    div.setAttribute("classID", classID);

    const subjectText = document.createElement("span");
    const subjectNameLong = document.createElement("span");
    subjectNameLong.textContent = subject.name;
    subjectNameLong.className = "long-name";
    const subjectNameShort = document.createElement("span");
    subjectNameShort.textContent = subject.shortName;
    subjectNameShort.className = "short-name";
    subjectText.appendChild(subjectNameShort);
    subjectText.appendChild(subjectNameLong);
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
        const firstNonTitle = [...targetBox.children].find(
            el => !el.classList.contains("box-title")
        );
        targetBox.insertBefore(div, firstNonTitle);
        updateButtonText();
        highlightMoved(div);
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
            const firstNonTitle = [...box.children].find(
                el => !el.classList.contains("box-title")
            );
            box.insertBefore(draggingItem, firstNonTitle);
            highlightMoved(draggingItem);
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
    userClass = await getUserSetting("untis", "classId")
    if (userClass.status == 200) {
        userClass = userClass.data;
    } else {
        userClass = -1;
    }
    if (allSubjects) {
        allSubjects = JSON.parse(allSubjects); // jetzt ein Array von Objekten
    } else {
        allSubjects =  (await getStaticData()).subjects
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


const toggle = document.getElementById("toggle-names");
const label = document.getElementById("toggle-label");

toggle.addEventListener("change", () => {
  const html = document.documentElement;
  const showShort = toggle.checked;

  if (showShort) {
    html.classList.add("c-short-names");
    html.classList.remove("c-full-names");
  } else {
    html.classList.add("c-full-names");
    html.classList.remove("c-short-names");
  }

  // Optional: speichern im localStorage
  localStorage.setItem("useShortNames", showShort ? "1" : "0");
});

// Initialzustand beim Laden
const useShort = localStorage.getItem("useShortNames") === "1";
toggle.checked = useShort;
document.documentElement.classList.add(useShort ? "c-short-names" : "c-full-names");
