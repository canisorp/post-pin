import express, { json } from 'express';
import postsRouter from './routes/posts.js';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1/posts', postsRouter);

app.get('/api/v1/healthcheck', (req, res) => {
	res.send('OK');
});

// Wrong path handler
app.all('*', (req, res, next) => {
	res.status(404).json({
		message: `Path ${req.originalUrl} does not exist for ${req.method} method`,
	});
});

// error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	if (err instanceof SyntaxError) {
		return res.status(400).json({ message: err.message });
	}
	return res.status(500).json({ message: 'Oops, something went wrong...' });
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});
