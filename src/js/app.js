// Here I am registering my service worker

if ('serviceWorker' in navigator) {
	// returns a promise you can await.
	navigator.serviceWorker.register(
		new URL('../../service-worker.js', import.meta.url),
		{
			scope: '/',
			type: 'module',
		}
	);
}
