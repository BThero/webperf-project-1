import compress from 'compression';
import express from 'express';
import serveStatic from 'serve-static';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
	Compress all text formats with gzip (task 4)
	It also does task 13 for me automatically because all request headers will have 'If-None-Match' header
*/
app.use(compress());

/*
	ServeStatic from http://expressjs.com/en/resources/middleware/serve-static.html
	I use it for ...
	For tasks 5, 6, 11, 12
*/
app.use(
	serveStatic('dist', {
		maxAge: '30d', // sets max-age cache property for all assets
		setHeaders: (res, path) => {
			if (serveStatic.mime.lookup(path) === 'text/html') {
				res.setHeader('Cache-Control', 'public, max-age=0'); // sets max-age=0 for html only
			}
		},
	})
);

spdy.createServer(options, app).listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
