import axios from 'axios';
import {key} from '../config';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {	
			const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			
		} catch (error) {
			console.error(error);
		}
	}

	calcTime() {
		// Assuming that we need 15 min for each 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
	}

	parseIngredients() {

		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
		const units = [...unitsShort, 'kg', 'g'];

		const newIngredients = this.ingredients.map(ing => {
			// 1) Uniform units
			let ingredient = ing.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, units[i]);
			});

			// 2) Remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3) Parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el => units.includes(el));

			let objIng = {};

			if(unitIndex > -1) {
				// There is a unit
				// Ex. 4 1/2 cups, arrCount is [4, 1/2]
				// Ex. 4 cups, arrCount is [4]

				const arrCount = arrIng.slice(0, unitIndex);

				arrCount[0] = arrCount[0].replace('-', '+');

				let count;
				if(arrCount.length === 1) {
					count = eval(arrCount[0]);
				} else {
					count = eval(arrCount.slice(0, unitIndex).join('+'));
				}

				objIng = {
					count: parseFloat(count.toFixed(2)),
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ').trim()
				}
				

			} else if(parseInt(arrIng[0], 10)) {
				// There is NO unit, but 1st element is number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}

			} else if(unitIndex === -1) {
				// There is no unit and NO number
				objIng = {
					count: 1,
					unit: '',
					ingredient
				}

			}

			return objIng;

		});

		this.ingredients = newIngredients; 
	}

	updateServings(type) {

		if(type) {

			// Servings
			const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

			// Ingredients
			this.ingredients.forEach(ing => {
				const diff = newServings/this.servings;
				ing.count *= diff;
			});

			this.servings = newServings;

		}


	}


}