import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiService from './picture-service';
import LoadMoreBtn from '/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const picturesApiService = new PicturesApiService();
let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250, captionsData: 'alt' });

refs.searchForm.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();

  picturesApiService.query = e.currentTarget.elements.searchQuery.value;

  picturesApiService.resetPage();
  clearGalleryContainer();
  fetchPictures();
}

async function fetchPictures() {
  loadMoreBtn.hide();
  const response = await picturesApiService.fetchPictures();

  const data = response.data;
  const totalHits = data.totalHits;
  const hits = data.hits;
  const page = response.config.params.page;

  if (hits.length !== 0) {
    renderPictures(hits);
    addLoadmoreBtn(hits, totalHits, page);
    weFound(hits);

    gallery.refresh();
  } else {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}

function renderPictures(hits) {
  const renderResult = hits
    .map(
      hits =>
        // `<a class="photo-card" href='${hits.largeImageURL}'><img src='${hits.webformatURL}' alt = '${hits.tags}'/></a>`,
        `<div class="photo-card">
            <a href=${hits.largeImageURL}>
                <img src=${hits.webformatURL} alt=${hits.tags} />
                </a>
                <div class="info">
                <p class="info-item">
                <b>Likes</b> ${hits.likes}
                </p>
                <p class="info-item">
                <b>Views</b> ${hits.views}
                </p>
                <p class="info-item">
                <b>Comments</b> ${hits.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b> ${hits.downloads}
                </p>
            </div>
        </div>`,
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', renderResult);
}

function addLoadmoreBtn(hits, totalHits, page) {
  console.log(hits.length * page <= totalHits);
  if (hits.length * page <= totalHits) {
    loadMoreBtn.show();
  } else {
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function weFound(hits) {
  Notify.success(`Hooray! We found ${hits.length} images.`);
}

refs.galleryContainer.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();
  console.log(evt.target);
}
