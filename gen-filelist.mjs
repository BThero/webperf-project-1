import fs from 'fs';
import mime from 'mime-types';
const dir = './dist/';

const cachable = [
	'font/woff2',
	'image/webp',
	'application/javascript',
	'image/png',
	'text/html',
	'text/css',
];

fs.readdir(dir, (error, files) => {
	if (error) {
		throw error;
	}

	files.forEach((file) => {
		const filetype = mime.lookup(file);
		const found = cachable.find((item) => item === filetype);

		if (found) {
			console.log('/' + file);
		}
	});
});
