import axios from 'axios';

const API_KEY = '27725160-470a636dc677cf333fa2ad496';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 200;

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    // console.log('response.data');
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: PER_PAGE,
          page: this.page,
        },
      });
      console.log(response);

      this.incrementPage();
      return response;
    } catch (error) {
      console.error(error);
    }

    // .then(response => response.json())
    // .then(({ articles }) => {
    //   this.incrementPage();
    //   return articles;
    // });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
