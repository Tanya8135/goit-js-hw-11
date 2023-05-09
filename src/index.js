import './css/styles.css';
import NewsApiService from './js/NewsApiService';
import { simpleLightbox } from './js/lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let isShown = 0;
const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3,
};
// const observer = new IntersectionObserver(onLoadMore, options);
// console.log(observer)

async function onSearch(element) {
  element.preventDefault();

  refs.gallery.innerHTML = '';
  newsApiService.query =
    element.currentTarget.searchQuery.value.trim(); /* delete 'elements' betwee currentTarget and searchQuery */
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  isShown = 0;
  await fetchGallery();
}

async function onLoadMore() {
  await fetchGallery();
}

async function fetchGallery() {
  try {
    const result = await newsApiService.fetchGallery();
    const { hits, total } = result;
    isShown += hits.length;

    if (!hits.length) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      refs.loadMore.classList.add('is-hidden');
      return;
    }

    onRenderGallery(hits);

    if (isShown < total) {
      Notify.success(`Hooray! We found ${total} images !!!`);
      refs.loadMore.classList.remove('is-hidden');
    }

    // total - загальна кількість зображень по назві
    if (isShown >= total) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Oops, something went wrong. Please try again later.');
  }
}


function onRenderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightbox.refresh();
}