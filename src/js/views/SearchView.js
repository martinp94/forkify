import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { 
	elements.searchInput.value = '';
}

export const highlightedSelected = id => {
	document.querySelector(`a[href="?#${id}"]`).classList.add('results__link--active');
	document.querySelectorAll(`.results__link`).forEach(link => {
		if(link.href.search(id) === -1)
			link.classList.remove('results__link--active');
	});
}

export const clearResults = () => { 
	elements.searchResList.innerHTML = '';
}

const limitRecipeTitle = (recipe, limit = 17) => {
	if(recipe.length > 17) {

		return recipe.split(' ').reduce((acc, curr) => {
			
			const tmp = `${acc} ${curr}`;
			if(tmp.length <= 17)
				acc = tmp;
			
			return acc;

		}, "") + '...';
	}

	return recipe;
}

const renderRecipe = recipe => {
	const markup = `
		<li>
            <a class="results__link" href="?#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
	`;


	elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const renderButtons = (currentPage, total) => {

	const previousPage = currentPage - 1, nextPage = currentPage + 1;

	const prevButtonMarkup = `
		<button class="btn-inline results__btn--prev">
	        <svg class="search__icon">
	            <use href="img/icons.svg#icon-triangle-left"></use>
	        </svg>
	        <span>Page ${previousPage}</span>
	    </button>
	  `,
	  nextButtonMarkup = `
	  	<button class="btn-inline results__btn--next">
	        <span>Page ${nextPage}</span>
	        <svg class="search__icon">
	            <use href="img/icons.svg#icon-triangle-right"></use>
	        </svg>
	    </button>
	  `;

	if(previousPage > 0)
		elements.resultPagesLinks.insertAdjacentHTML('afterbegin', prevButtonMarkup);
	if(nextPage < total)
		elements.resultPagesLinks.insertAdjacentHTML('beforeend', nextButtonMarkup);

}

export const renderResults = (recipes, page = 1, itemsPerPage = 5) => {
	
	const end = page * itemsPerPage,
		  start = end - itemsPerPage,
		  pagesTotal = Math.ceil(recipes.length / itemsPerPage);


	recipes.slice(start, end).forEach(renderRecipe);

	renderButtons(page, pagesTotal);

	return page;
}