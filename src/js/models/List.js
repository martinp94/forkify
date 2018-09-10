import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}

	addItem(count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		}

		this.items.push(item);
		return item;
	}

	deleteItem(id) {
		this.items.splice(this.items.findIndex(el => el.id === id), 1);
	}

	updateCount(id, newCount) {
		this.items.forEach(item => {
			this.items.find(item => item.id === id).count = newCount;
		});
	}
}