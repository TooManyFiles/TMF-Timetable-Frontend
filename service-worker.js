const CACHE_NAME_PERMANENT = 'cache-permanent-v1';
const CACHE_NAME_AUTO = 'cache-auto-v1';
const CACHE_NAME_MAX_AGE = 'cache-max-age-v1';
const CACHE_NAME_ALWAYS_UPDATE = 'cache-always-update-v1';

var filesToCache, permanentFiles, alwaysUpdateFiles, maxAgeFiles

let CACHE_CONFIG = null;
async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('cacheConfigDB', 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('config', { keyPath: 'id' });
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

async function getConfigFromDB(db) {
    return new Promise((resolve, reject) => {

        const transaction = db.transaction('config', 'readonly');
        const store = transaction.objectStore('config');
        const request = store.get('config');

        request.onsuccess = () => {
            resolve(request.result ? request.result.data : null);
        };
        request.onerror = () => {
            console.log("load error")
            reject(request.error);
        };
    });
}

async function saveConfigToDB(db, config) {
    return new Promise((resolve, reject) => {

        const transaction = db.transaction('config', 'readwrite');
        const store = transaction.objectStore('config');
        const itemToSave = { id: 'config', data: config };

        // Log the data structure before saving
        console.debug('Saving to DB:', itemToSave);

        const request = store.put(itemToSave); // Store the object
        request.onsuccess = () => resolve();
        request.onerror = () => {
            console.log("save error")
            reject(request.error);
        };
    });
}
// Fetch the cache configuration from /cache/toCache.json
async function fetchCacheConfig() {
    try {
        // Check if the configuration exists in local storage
        const db = await openDatabase();
        let cachedConfig = await getConfigFromDB(db);

        if (cachedConfig) {
            // If it exists, parse it
            CACHE_CONFIG = cachedConfig;

            // compare versions
            const response = await fetch('/cache/toCache.json');
            if (response.status === 200) {
                const cacheConfig = await response.json();
                if (cacheConfig.version !== CACHE_CONFIG.version) {
                    CACHE_CONFIG = cacheConfig
                    if (Array.isArray(CACHE_CONFIG.force)) {
                        for (let i = 0; i < CACHE_CONFIG.force.length; i++) {
                            if (typeof CACHE_CONFIG.force[i] === "string") {
                                CACHE_CONFIG.force[i] = { path: CACHE_CONFIG.force[i], maxAge: -1 };
                            }
                        }
                    } else {
                        CACHE_CONFIG.force = collectFilesToCache(CACHE_CONFIG.force);
                    }
                    await saveConfigToDB(db, CACHE_CONFIG); // Save the fetched configuration

                    filesToCache = CACHE_CONFIG.force;
                    console.debug('Files to cache:', filesToCache.map(file => file.path));
                    permanentFiles = filesToCache.filter(file => file.maxAge === -1);
                    console.debug('Files to cache (permanent):', permanentFiles.map(file => file.path));
                    alwaysUpdateFiles = filesToCache.filter(file => file.maxAge === 0);
                    console.debug('Files to cache (always update):', alwaysUpdateFiles.map(file => file.path));
                    maxAgeFiles = filesToCache.filter(file => file.maxAge > 0);
                    console.debug('Files to cache (max Age):', maxAgeFiles.map(file => file.path));
                    console.debug("Refetch all cached data and updated config!")
                    fetchAllData()
                    return
                }
            }


            console.debug('Cache config loaded from local storage:', CACHE_CONFIG);

        } else {
            // If not, fetch it from the server
            const response = await fetch('/cache/toCache.json');
            CACHE_CONFIG = await response.json();

            if (Array.isArray(CACHE_CONFIG.force)) {
                for (let i = 0; i < CACHE_CONFIG.force.length; i++) {
                    if (typeof CACHE_CONFIG.force[i] === "string") {
                        CACHE_CONFIG.force[i] = { path: CACHE_CONFIG.force[i], maxAge: -1 };
                    }
                }
            } else {
                CACHE_CONFIG.force = collectFilesToCache(CACHE_CONFIG.force);
            }
            await saveConfigToDB(db, CACHE_CONFIG); // Save the fetched configuration
            console.debug('Cache config loaded from server:', CACHE_CONFIG);
        }
    } catch (error) {
        console.error('Failed to fetch cache configuration:', error);
    }
    filesToCache = CACHE_CONFIG.force;
    console.debug('Files to cache:', filesToCache.map(file => file.path));
    permanentFiles = filesToCache.filter(file => file.maxAge === -1);
    console.debug('Files to cache (permanent):', permanentFiles.map(file => file.path));
    alwaysUpdateFiles = filesToCache.filter(file => file.maxAge === 0);
    console.debug('Files to cache (always update):', alwaysUpdateFiles.map(file => file.path));
    maxAgeFiles = filesToCache.filter(file => file.maxAge > 0);
    console.debug('Files to cache (max Age):', maxAgeFiles.map(file => file.path));
}
async function fetchAllData() {

    const permanentCache = await caches.open(CACHE_NAME_PERMANENT);
    const permanentUrlsToCache = permanentFiles.map(file => file.path);
    try {
        for (const url of permanentUrlsToCache) {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch ${url}: ${response.status}`);
                continue; // Skip this URL and continue with others
            }
            await permanentCache.add(url); // Add individual URL to cache
        }
        console.debug('Permanent files cached successfully');
    } catch (error) {
        console.error('Failed to cache permanent files:', error);
    }

    const alwaysCache = await caches.open(CACHE_NAME_ALWAYS_UPDATE, {
        durability: 'strict', // Or `'relaxed'`.
        persisted: true, // Or `false`.
    });
    const alwaysFilesUrlsToCache = alwaysUpdateFiles.map(file => file.path);
    try {
        for (const url of alwaysFilesUrlsToCache) {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch ${url}: ${response.status}`);
                continue; // Skip this URL and continue with others
            }
            await alwaysCache.add(url); // Add individual URL to cache
        }
        console.debug('Always update files cached successfully');
    } catch (error) {
        console.error('Failed to cache always update files:', error);
    }
    const maxAgeCache = await caches.open(CACHE_NAME_MAX_AGE);
    const maxAgeFilesUrlsToCache = maxAgeFiles.map(file => file.path);
    try {
        for (const url of maxAgeFilesUrlsToCache) {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch ${url}: ${response.status}`);
                continue; // Skip this URL and continue with others
            }
            await maxAgeCache.add(url); // Add individual URL to cache
        }
        console.debug('Always update files cached successfully');
    } catch (error) {
        console.error('Failed to cache always update files:', error);
    }
}

// Recursively collect files for caching based on configuration
function collectFilesToCache(structure, parentPath = '', maxAge = -1) {
    let files = [];
    for (const key in structure) {
        if (key == "maxAge") {
            if (typeof structure[key] === 'number') {
                maxAge = structure[key]
                continue
            } else {
                throw "mallformededaaaaa" // TODO: fix
            }
        }
        if (typeof structure[key] === 'object') {
            if (Object.keys(structure[key]).length === 0) {
                files.push({ path: `${parentPath}${key}`, maxAge: maxAge });
            } else if (
                Object.keys(structure[key]).length === 1
                && structure[key].hasOwnProperty('maxAge')
            ) {
                files.push({ path: `${parentPath}${key}`, maxAge: structure[key].maxAge })
            } else {
                files.push(...collectFilesToCache(structure[key], `${parentPath}${key}/`, maxAge));
            }
        } else {
            throw "mallformededbbbb" // TODO: fix
        }
    }
    return files;
}

// Install event: Cache permanent files and setup other caches
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            console.debug('Service Worker: Installing and fetching cache config...');
            await fetchCacheConfig();

            if (!CACHE_CONFIG) return;

            await fetchAllData();
        })()
    );
});

// Fetch event: Handle different caching rules based on the configuration
self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            if (!CACHE_CONFIG) {
                await fetchCacheConfig();
            }

            const requestUrl = new URL(event.request.url);
            // Permanent cache: Serve from the permanent cache if no other rules apply
            if (permanentFiles.some(file => requestUrl.pathname.endsWith(file.path))) { //TODO: DOMAIN
                const permanentCache = await (await caches.open(CACHE_NAME_PERMANENT)).match(event.request, { ignoreVary: true });
                if (permanentCache) {
                    console.debug(`Serving from permanent cache: ${requestUrl.href}`);
                    return permanentCache;
                } else {
                    const response = await fetch(event.request);
                    const cache = await caches.open(CACHE_NAME_ALWAYS_UPDATE);
                    try {
                        await cache.put(event.request, response.clone());
                        console.debug(`Added to permanent cache: ${requestUrl.href}`);
                    } catch (error) {
                        console.error('Failed to update permanent:', error);
                    }
                    return response;
                }
            }
            // Always update cache
            if (alwaysUpdateFiles.some(file => requestUrl.pathname.endsWith(file.path))) { //TODO: DOMAIN
                const cache = await caches.open(CACHE_NAME_ALWAYS_UPDATE);
                try {
                    const response = await fetch(event.request);
                    console.debug("resons ok")
                    await cache.put(event.request, response.clone());
                    console.debug(`Always updated cache: ${requestUrl.href}`);
                    return response;
                } catch (error) {
                    cachedResponse = await cache.match(event.request)
                    if (cachedResponse) {
                        console.debug(`Always update: Serving from cache as fallback: ${requestUrl.href}`);
                        return cachedResponse;
                    }
                    console.error('Failed to update always cache:', error);
                }
            }

            // Max age cache
            const maxAgeFile = maxAgeFiles.find(file => requestUrl.pathname.endsWith(file.path));
            if (maxAgeFile) {
                const cache = await caches.open(CACHE_NAME_MAX_AGE);
                const cachedResponse = await cache.match(event.request, { ignoreVary: true });
                if (cachedResponse) {
                    const cachedDate = new Date(cachedResponse.headers.get('date'));
                    const ageInHours = (Date.now() - cachedDate.getTime()) / 1000 / 60 / 60;
                    if (ageInHours < maxAgeFile.maxAge) {
                        console.debug(`Serving from max-age cache: ${requestUrl.href}`);
                        return cachedResponse;
                    }
                }

                const networkResponse = await fetch(event.request);
                try {
                    await cache.put(event.request, networkResponse.clone());
                    console.debug(`Max-age cache updated: ${requestUrl.href}`);
                } catch (error) {
                    cachedResponse = await cache.match(event.request, { ignoreVary: true })
                    if (cachedResponse) {
                        console.debug(`Max-age: Serving from cache as fallback: ${requestUrl.href}`);
                        return cachedResponse;
                    }
                    console.error('Failed to update max-age cache:', error);
                }
                return networkResponse;
            }

            // Automatic caching for autoCacheDomains
            if (CACHE_CONFIG.autoCache) {
                const autoCacheDomain = CACHE_CONFIG.autoCacheDomains.length === 0 || CACHE_CONFIG.autoCacheDomains.some(domain => new RegExp(domain).test(requestUrl.origin));

                if (autoCacheDomain) {
                    // Handle preventAutoCache logic
                    if (CACHE_CONFIG.preventAutoCache.some(pattern => new RegExp(pattern).test(requestUrl.href))) {
                        console.debug(`Prevented caching of ${requestUrl.href}`);
                        return fetch(event.request);
                    }
                    const cache = await caches.open(CACHE_NAME_AUTO);
                    const cachedResponse = await cache.match(event.request, { ignoreVary: true });
                    if (cachedResponse) {
                        console.debug(`Serving from auto cache: ${requestUrl.href}`);
                        return cachedResponse;
                    }

                    const networkResponse = await fetch(event.request);
                    try {
                        await cache.put(event.request, networkResponse.clone());
                        console.debug(`Auto cache updated: ${requestUrl.href}`);
                    } catch (error) {
                        console.error('Failed to update auto cache:', error);
                    }
                    return networkResponse;
                }
            }
            console.debug("remote get", requestUrl);
            return fetch(event.request);
        })()
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [
        CACHE_NAME_PERMANENT,
        CACHE_NAME_AUTO,
        CACHE_NAME_MAX_AGE,
        CACHE_NAME_ALWAYS_UPDATE
    ];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.debug(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
