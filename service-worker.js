console.log('lol');
const CACHE = 'cache-v1';

// Add content to the cache when the service worker is installed.
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			cache.addAll(['/']);
		})
	);

	console.log('install complete');
});

// Intercept fetch requests.
self.addEventListener('fetch', (event) => {
	console.log('got');

	// First, satisfy the request with cached content.
	event.respondWith(fetchFromCache(event.request));

	// Then, update the cache.
	event.waitUntil(updateCache(event.request));
});

// Fetches the requested content from the cache.
function fetchFromCache(request) {
	return caches.match(request).then((matching) => {
		if (matching) {
			return matching;
		}

		return fetch(request);
	});
}

// Updates the cache from the server.
function updateCache(request) {
	return caches.open(CACHE).then((cache) => {
		return fetch(request).then((response) => {
			return cache.put(request, response.clone()).then(() => {
				return response;
			});
		});
	});
}
