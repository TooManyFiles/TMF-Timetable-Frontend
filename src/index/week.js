import { getWeek } from "../api/other.js";
import { getMonday } from "../utils/utils.js";
import { dateToString } from "../utils/utils.js";

const week = await getWeek(dateToString(getMonday()));
document.getElementById('week-indicator').textContent = week;
