const jsonUrl = '../data/posts.json';

let posts = null;

export const loadData = async () => {
	fs.readFile()
	if (!posts) {
		posts = await fetch(jsonUrl).then((res) => res.json());
	}
	console.log(posts);
};
