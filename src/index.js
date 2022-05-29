import './css/styles.css';

import axios from 'axios';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

// import API from './fetchCountry';

// findPictures();

const form = document.querySelector('form');
const galleryList = document.querySelector('.gallery');

let query;

form.addEventListener('submit', e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  query = searchQuery.value;
  findPictures(query);
  //   console.log(searchQuery.value);
});

async function findPictures() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '27725160-470a636dc677cf333fa2ad496',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 20,
        page: 1,
      },
    });

    //   console.log(response.config.params.page);
    const page = response.config.params.page;

    const data = response.data;
    const totalHits = data.totalHits;
    const hits = data.hits;
    const galleryList = document.querySelector('.gallery');
    galleryList.innerHTML = '';

    console.log(data);

    if (hits.length !== 0) {
      renderPictures(hits);
      addLoadmoreBtn(hits, totalHits, page);
    } else {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  } catch (error) {
    // console.error(error);
  }
}

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

  galleryList.insertAdjacentHTML('beforeend', renderResult);
}

function addLoadmoreBtn(hits, totalHits, page) {
  console.log(hits.length * page <= totalHits);
  if (hits.length * page <= totalHits) {
    const loadMoreButton = `
          <button class="load-more" type="button">Load more</button>
             `;
    galleryList.insertAdjacentHTML('afterend', loadMoreButton);
  } else {
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
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
