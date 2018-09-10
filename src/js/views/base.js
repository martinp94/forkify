export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	searchResList: document.querySelector('.results__list'),
	searchRes: document.querySelector('.results'),
	resultPagesLinks: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shoppingList: document.querySelector('.shopping__list'),
	likes: document.querySelector('.likes__list'),
	likesMenu: document.querySelector('.likes__field')
};

export const renderLoader = parent => {
	const loader = `
		<div class="loader">
			<svg> 
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;	

	parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearButtons = parent => parent.querySelectorAll('button').forEach(btn => btn.remove());

export const clearLoader = parent => parent.querySelector('.loader').remove();