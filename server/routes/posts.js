import { readFileSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const postsPath = './data/posts.json';

const router = Router();

class InvalidBody extends Error {}

router.get('/:id', (req, res) => {
	const { id } = req.params;
	const posts = readFileSync(postsPath, 'utf8');
	const json = JSON.parse(posts);
	const existingPost = json.posts.find((post) => post.id === id);
	if (!existingPost) {
		return res.status(404).json({ message: 'Post not found' });
	}
	return res.status(200).json(existingPost);
});

router.get('/', (req, res, next) => {
	try {
		const posts = readFileSync(postsPath, 'utf8');
		const json = JSON.parse(posts);
		return res.json(json.posts);
	} catch (e) {
		return next(e);
	}
});

router.post('/', (req, res, next) => {
	const { title, postBody } = req.body;
	if (!title) {
		throw new InvalidBody('title is required!');
	}
	if (!postBody) {
		throw new InvalidBody('postBody is required!');
	}
	try {
		const id = uuidv4();
		const newPost = { id, title, postBody };
		const posts = readFileSync(postsPath, 'utf8');
		const json = JSON.parse(posts);
		json.posts.push(newPost);
		writeFileSync(postsPath, JSON.stringify(json));
		return res.status(201).json(newPost);
	} catch (e) {
		return next(e);
	}
});

router.put('/:id', (req, res, next) => {
	const { id } = req.params;
	const { title, postBody } = req.body;
	console.log(req.body);
	try {
		const posts = readFileSync(postsPath, 'utf8');
		const json = JSON.parse(posts);
		const existingPost = json.posts.find((post) => post.id === id);
		if (!existingPost) {
			return res.status(404).json({ message: 'Post not found' });
		}
		if (!title && !postBody) {
			return res.status(400).json({
				message:
					'Nothing to update, please provide one of the fields to update: title, postBody',
			});
		}
		if (title) {
			existingPost.title = title;
		}
		if (postBody) {
			existingPost.postBody = postBody;
		}
		json.posts = json.posts.map((post) => {
			if (post.id === id) {
				return existingPost;
			}
			return post;
		});
		writeFileSync(postsPath, JSON.stringify(json));
		return res.status(200).json(existingPost);
	} catch (e) {
		return next(e);
	}
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	try {
		const posts = readFileSync(postsPath, 'utf8');
		const json = JSON.parse(posts);
		const existingPost = json.posts.find((post) => post.id === id);
		if (!existingPost) {
			return res.status(204).json({ message: 'Post not found' });
		}
		json.posts = json.posts.filter((post) => post.id !== existingPost.id);
		writeFileSync(postsPath, JSON.stringify(json));
		return res.status(200).json({ message: 'Post deleted successfully' });
	} catch (e) {
		return next(e);
	}
});

router.use((err, req, res, next) => {
	if (err instanceof InvalidBody) {
		return res.status(400).json({ message: err.message });
	}
	console.error(err.stack);
	return res.status(500).json({ message: 'Oops, something went wrong...' });
});

export default router;
