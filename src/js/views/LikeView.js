import { elements } from './base';

export const renderItem = item => {

	const markup = `
		<li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${item.title}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>
	`;

	elements.likes.insertAdjacentHTML('afterbegin', markup);
}

export const toggleLikeButton = isLiked => {
	const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
	elements.likesMenu.style.visibility = numLikes === 0 ? 'hidden' : 'visible';
}

export const clearItem = id => {
	elements.likes.querySelector(`a[href="#${id}"]`).remove();
}