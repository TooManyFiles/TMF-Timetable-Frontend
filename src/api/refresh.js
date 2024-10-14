import { fetchAndDisplayMenu } from '../index/table/foodplan.js';
import { setLastRefreshed, setLoading, getCurrentTime } from '../index/table/statusDisplay.js'
import { getView } from './view.js';

async function refreshAll(){
    setLoading();
    await fetchAndDisplayMenu();
    setLastRefreshed(getCurrentTime());
    await getView(dateToString(getMonday()), 6);
    window.generateSchedule();
}

window.refreshAll = refreshAll;