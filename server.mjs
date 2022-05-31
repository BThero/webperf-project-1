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
	key: fs.readFileSync(__dirname + '/localhost-privkey.pem'),
	cert: fs.readFileSync(__dirname + '/localhost-cert.pem'),
};

const app = express();
const port = 3000;

app.use(compress());

app.use(
	serveStatic('dist', {
		maxAge: '5s',
		setHeaders: (res, path) => {
			if (serveStatic.mime.lookup(path) === 'text/html') {
				res.setHeader('Cache-Control', 'public, max-age=0');
			}
		},
	})
);

spdy.createServer(options, app).listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
