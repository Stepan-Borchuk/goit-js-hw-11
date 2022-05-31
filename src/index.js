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
  const pattern = /\w{1,}/gi;
  //   const searchQuery = e.currentTarget.elements.searchQuery.value;

  picturesApiService.query = e.currentTarget.elements.searchQuery.value;

  //   console.log(picturesApiService.query.match(pattern));

  if (pattern.test(picturesApiService.query)) {
    picturesApiService.resetPage();
    clearGalleryContainer();
    fetchPictures();
  } else {
    Notify.warning('Please, enter a valid search query.', {
      timeout: 3000,
      position: 'center-center',
    });
  }
}

async function fetchPictures() {
  loadMoreBtn.hide();
  const response = await picturesApiService.fetchPictures();

  const data = response.data;
  const totalHits = data.totalHits;
  const hits = data.hits;
  const page = response.config.params.page;
  const perPage = response.config.params.per_page;

  if (hits.length !== 0) {
    await renderPictures(hits);
    addLoadmoreBtn(hits, totalHits, page, perPage);
    weFound(hits);

    gallery.refresh();
  } else {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
      timeout: 3000,
      position: 'center-center',
    });
  }
}

async function renderPictures(hits) {
  const renderResult = hits
    .map(
      hits =>
        `<div class="photo-card">
            <a href=${hits.largeImageURL}>
                <img src=${hits.webformatURL} alt=${hits.tags} loading="lazy" />
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

function addLoadmoreBtn(hits, totalHits, page, perPage) {
  if (hits.length * page <= totalHits) {
    loadMoreBtn.show();
  }
  if (perPage >= totalHits || hits.length * page > totalHits) {
    loadMoreBtn.hide();
    Notify.info("We're sorry, but you've reached the end of search results.", {
      timeout: 3000,
      position: 'center-center',
    });
  }
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function weFound(hits) {
  Notify.success(`Hooray! We found ${hits.length} images.`, {
    timeout: 3000,
    position: 'center-center',
    opacity: 0.8,
  });
}

refs.galleryContainer.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();
}
