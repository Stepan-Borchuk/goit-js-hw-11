import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiService from './picture-service';
import LoadMoreBtn from '/load-more-btn';

// Notify.failure({
//   width: '280px',
//   position: 'center-center', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
//   timeout: 10000,
// });

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();

  //   console.log(e.currentTarget.elements.searchQuery.value);

  picturesApiService.query = e.currentTarget.elements.searchQuery.value;

  //   //   if (newsApiService.query === '') {
  //   //     return alert('Введи что-то нормальное');
  //   //   }

  //   //   loadMoreBtn.show();
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
  } else {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}
//   loadMoreBtn.enable();
//   });

// findPictures();

// const form = document.querySelector('form');
// const galleryList = document.querySelector('.gallery');

// let query;

// form.addEventListener('submit', e => {
//   e.preventDefault();
//   const {
//     elements: { searchQuery },
//   } = e.currentTarget;
//   query = searchQuery.value;
//   findPictures(query);
//   //   console.log(searchQuery.value);
// });

// async function findPictures() {
//   const KEY = '27725160-470a636dc677cf333fa2ad496';
//   const PER_PAGE = 20;
//   this.page = 1;

//   try {
//     const response = await axios.get('https://pixabay.com/api/', {
//       params: {
//         key: KEY,
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: PER_PAGE,
//         page: this.page,
//       },
//     });

//     //   console.log(response.config.params.page);
//     const page = response.config.params.page;

//     const data = response.data;
//     const totalHits = data.totalHits;
//     const hits = data.hits;
//     const galleryList = document.querySelector('.gallery');
//     galleryList.innerHTML = '';

//     console.log(data);

//     if (hits.length !== 0) {
//       renderPictures(hits);
//       addLoadmoreBtn(hits, totalHits, page);
//     } else {
//       Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//     }
//   } catch (error) {
//     // console.error(error);
//   }
// }

function renderPictures(hits) {
  const renderResult = hits
    .map(
      hits =>
        `   <div class="photo-card">
              <img src=${hits.webformatURL} alt=${hits.tags} loading="lazy" />
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

// async function loadMorePictures(page) {
//     try {
//         const response = await axios.get('https://pixabay.com/api/', {
//         params: {
//             page += 1
//         },
//         });

//         renderPictures(hits);
//     } catch (error) {
//         // console.error(error);
//     }
// }
