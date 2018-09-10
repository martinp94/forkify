import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as shoppingListView from './views/ShoppingListView';
import * as likeView from './views/LikeView';
import { elements, renderLoader, clearLoader, clearButtons } from './views/base';

const state = {};

const renderResultsOnPage = (page = 1) => {
	searchView.clearResults();
	state.currentPage = searchView.renderResults(state.search.result, page);
}


/*
* SEARCH CONTROLLER
*/
const controlSearch = async () => {
	// 1. Get query from view 
	const query = searchView.getInput();

	if(query) {
		// 2. New search object and add to state

		state.search = new Search(query);

		// 3) Prepare UI for results


		searchView.clearInput();
		searchView.clearResults();
		clearButtons(elements.resultPagesLinks);
		renderLoader(elements.searchRes);

		// 4.) Search for recipes 

		try {
			await state.search.getResults();
			// 5) render results on UI
			clearLoader(elements.searchRes);
			renderResultsOnPage();

		} catch (err) {
			alert('Something wrong with the search...');
			clearLoader(elements.searchRes);
		}

		
		
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.resultPagesLinks.addEventListener('click', e => {
	
	e.preventDefault();

	if(e.target.classList.contains('results__btn--prev')) {
		clearButtons(elements.resultPagesLinks);
		renderResultsOnPage(state.currentPage - 1);
	}
	
	if(e.target.classList.contains('results__btn--next')) {
		clearButtons(elements.resultPagesLinks);
		renderResultsOnPage(state.currentPage + 1);
	}

});

/*
* RECIPE CONTROLLER
*/

const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');

	if(id) {

		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Highlight selected item
		
		if(state.search)
			searchView.highlightedSelected(id);

		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// Render recipe
			clearLoader(elements.recipe);

			recipeView.renderRecipe(
				state.recipe,
				state.likes ? state.likes.isLiked(id) : false

			);

			// Attach event listeners to update servings buttons

			document.querySelectorAll('.recipe__info-buttons > button').forEach(btn => btn.addEventListener('click', updateRecipeServings));
			document.querySelector('.btn-shopping-cart').addEventListener('click', listControl);
			document.querySelector('.recipe__love').addEventListener('click', controlLikes);


		} catch (err) {
			alert('Error processing recipe');
		}
		
	}
}

const updateRecipeServings = event => {
	if(event.target.classList.contains('btn-plus')) {
		state.recipe.updateServings('inc');
	}

	if(event.target.classList.contains('btn-minus')) {
		state.recipe.updateServings('dec');
	}

	recipeView.clearRecipe();
	recipeView.renderRecipe(state.recipe);

	document.querySelectorAll('.recipe__info-buttons > button').forEach(btn => btn.addEventListener('click', updateRecipeServings));
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
* LIST CONTROLLER
*/

// Handle deleted and updated items

elements.shoppingList.addEventListener('click', e => {

	const item = e.target.closest('.shopping__item'),
			  id = item.dataset.itemid;

	if(e.target.matches('.shopping__delete')) {
		

		state.list.deleteItem(id);
		shoppingListView.clearItem(item);
	}

	if(e.target.matches('.shopping__count-value')) {
		const value = e.target.value;
		state.list.updateCount(id, value);
		
		e.target.addEventListener('input', e => {
			state.list.updateCount(id, value);
		});
	}
});

const listControl = () => {

	if(!state.list) {

		// Create new List object

		state.list = new List();

		// Prepare UI 

		shoppingListView.clearShoppingList();

		// Add items to list

		for(let ingredient of state.recipe.ingredients) {
			state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient);
		}


		// Display shopping list

		for (let listItem of state.list.items) {
			shoppingListView.renderItem(listItem);
		}

		//console.log(state.list);
	}
	
}

/*
* LIKES CONTROLLER 
*/


const controlLikes = () => {
	if(!state.likes)
		state.likes = new Like();

	// IF recipe state exists, then add recipe if is not already liked

	if(state.recipe) {

		if(!state.likes.isLiked(state.recipe.id)) {
			const like = state.likes.addLike(state.recipe.id, state.recipe.title, state.recipe.author, state.recipe.img);
			likeView.renderItem(like);

			// CLEAR SEARCH STATE WHEN LIKED RECIPE LINK CLICKED

			document.querySelectorAll('.likes__link').forEach(el => el.addEventListener('click', e => {
				state.search = null;
			}));

			// toggle like button
			likeView.toggleLikeButton(true);

		} else {
			state.likes.removeLike(state.recipe.id);
			likeView.clearItem(state.recipe.id);

			// toggle like button
			likeView.toggleLikeButton(false);

		}

		// toggle likes menu
		likeView.toggleLikeMenu(state.likes.getNumberOfLikes());


	}

}

window.addEventListener('load', () => {

	// Retrieve data from storage
	state.likes = new Like();
	state.likes.readStorage();

	// toggle likes menu
	likeView.toggleLikeMenu(state.likes.getNumberOfLikes());

	// Render likes

	state.likes.getLikes().forEach(like => likeView.renderItem(like));

	console.log(state);
});