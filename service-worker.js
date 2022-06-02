import fs from 'fs';

const text = fs.readFileSync('cachable.txt', 'utf-8');
const files = text.split('\n');
const CACHE = 'cache-v1';

// Add content to the cache when the service worker is installed.
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			cache.addAll(files);
		})
	);
});

// Intercept fetch requests.
self.addEventListener('fetch', (event) => {
	// Satisfy the request with cached content.
	event.respondWith(fetchFromCache(event.request));
});

// Fetches the requested content from the cache.
async function fetchFromCache(request) {
	return caches.match(request).then((matching) => {
		if (matching) {
			return matching;
		}

		return fetch(request);
	});
}
