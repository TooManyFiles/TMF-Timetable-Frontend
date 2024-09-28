import { fetchAndDisplayMenu } from '..//foodplan.js';
import { setLastRefreshed, setLoading, getCurrentTime } from '..//statusDisplay.js'

async function refreshAll(){
    setLoading();
    await fetchAndDisplayMenu();
    setLastRefreshed(getCurrentTime());
}

window.refreshAll= refreshAll;