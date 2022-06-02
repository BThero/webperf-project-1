import compress from 'compression';
import express from 'express';
import serveStatic from 'serve-static';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use self-signed certificates for HTTPS
// __dirname issue solved: https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope#:~:text=The%20__dirname%20or%20__,directory%20name%20of%20the%20path.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
	key: fs.readFileSync(
		__dirname + '/cert/CA/localhost/localhost.decrypted.key'
	),
	cert: fs.readFileSync(__dirname + '/cert/CA/localhost/localhost.crt'),
};

const app = express();
const port = 3000;

/* 
	Compress all text formats with gzip compression middleware
	It also handles conditional requests automatically because all request headers have 'If-None-Match' header
*/
app.use(compress());

/*
	ServeStatic middleware from http://expressjs.com/en/resources/middleware/serve-static.html
	
	- maxAge property is a default max-age for all resources
	- using setHeaders function I additionally set 'Service-Worker-Allowed' for my service-worker.js file
	- also I prevent my html file from being cached

	All assets are versioned automatically with parcel, so I can allow myself to put a big max-age parameter
*/
app.use(
	serveStatic('dist', {
		maxAge: '30d', // sets max-age cache property for all assets
		setHeaders: (res, path) => {
			if (path.endsWith('service-worker.js')) {
				res.setHeader('Service-Worker-Allowed', '/');
			}

			if (serveStatic.mime.lookup(path) === 'text/html') {
				res.setHeader('Cache-Control', 'public, max-age=0'); // sets max-age=0 for html only
			}
		},
	})
);

// Using spdy + express
spdy.createServer(options, app).listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
