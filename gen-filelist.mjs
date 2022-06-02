import fs from 'fs';
import mime from 'mime-types';

// Array of all cachable file formats for service worker
const cachable = [
	'font/woff2',
	'image/webp',
	'application/javascript',
	'image/png',
	'text/html',
	'text/css',
];

const dir = './dist/';

fs.readdir(dir, (error, files) => {
	if (error) {
		throw error;
	}

	files.forEach((file) => {
		// Checking if filetype should be cached
		const filetype = mime.lookup(file);
		const found = cachable.find((item) => item === filetype);

		if (found) {
			// Printing to stdout
			console.log('/' + file);
		}
	});
});
