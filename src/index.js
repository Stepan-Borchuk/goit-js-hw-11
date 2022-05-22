import './css/styles.css';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import API from './fetchCountry';


const DEBOUNCE_DELAY = 300;


const refs = {
    searchCountry: document.querySelector('input'),
    list: document.querySelector('.country-list'),
    card: document.querySelector('.country-info')
}
    

refs.searchCountry.addEventListener('input', debounce((event) => {
    const countryName = event.target.value.trim()
    if (countryName !== "") {
      fetchCounry(countryName)
    } 
    
}, DEBOUNCE_DELAY)) 


function clearCountryList() {
    refs.list.innerHTML = "";
}

function clearCountryCard() {
    refs.card.innerHTML = "";
}

function createCountryList(countries) {
    clearCountryCard();
    const markup = countries
                .map(countries =>            
                    `<div class="countries__list">
                        <img width= 100px src=${countries.flags.svg} alt='${countries.name}'>
                        <h2 class="countries__names">${countries.name.official}</h2>      
                    </div>`)
                .join("")
                
            refs.list.innerHTML = markup;
}

function createCountryCard(countries) {
    if (countries.length === 1) {
        clearCountryCard();

        const card = `
                <p> Capital: ${countries[0].capital} </p>
                <p> Population: ${countries[0].population} </p>
                <p> Languages: ${Object.values(countries[0].languages)} </p>`
            
        refs.card.innerHTML = card;
    }
}

function ifCardsSoMore(countries) {
      if (countries.length >= 20) {
            clearCountryList();
            Notify.info('Too many matches found. Please enter a more specific name.');
             } else {
               createCountryList(countries)
            createCountryCard(countries)  
            }
}

function fetchCounry(countryName) {
    API.fetchCountry(countryName).then(ifCardsSoMore).catch(error => {
            clearCountryList()
            clearCountryCard();
            Notify.failure('Oops, there is no country with that name')
        }) 
}