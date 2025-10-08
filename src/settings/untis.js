import { updateUntisAccount } from "../api/auth.js";

const untisForm = document.getElementById("untis-form");
const feedback = document.getElementById("untis-feedback");

untisForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const forename = document.getElementById("forename").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const username = document.getElementById("username").value.trim();
    const untisPWD = document.getElementById("untisPWD").value;

    feedback.textContent = "Updating...";
    feedback.style.color = "#333";

    try {
        const res = await updateUntisAccount(forename, surname, username, untisPWD);
        if (res.status == 200) {
            feedback.textContent = "Untis account updated successfully!";
            feedback.style.color = "green";
        } else {
            feedback.textContent = res.message || "Failed to update account.";
            feedback.style.color = "red";
        }
    } catch (err) {
        feedback.textContent = "Failed to update account: " + err.message;
        feedback.style.color = "red";
        console.error(err);
    }
});
