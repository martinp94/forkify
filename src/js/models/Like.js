
export default class Like {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, author, img) {
		const like = {
			id,
			title,
			author,
			img
		};

		this.likes.push(like);
		
		this.persistData();
		return like;
	}

	removeLike(id) {
		this.likes.splice(this.likes.findIndex(el => el.id === id), 1);
		this.persistData();
	}

	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}

	getNumberOfLikes() {
		return this.likes.length;
	}

	getLikes() {
		return this.likes;
	}

	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}

	readStorage() {
		const storage = JSON.parse(localStorage.getItem('likes'));

		// Restore likes
		if(storage)	this.likes = storage;
	}

}