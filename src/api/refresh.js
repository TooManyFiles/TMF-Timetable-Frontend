import { fetchAndDisplayMenu } from '../foodplan.js';
import { setLastRefreshed, setLoading, getCurrentTime } from '../statusDisplay.js'
import { getView } from './view.js';

async function refreshAll(){
    setLoading();
    await fetchAndDisplayMenu();
    setLastRefreshed(getCurrentTime());
    getView(dateToString(getMonday()), 6);
}

window.refreshAll = refreshAll;