import './css/styles.css';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import API from './fetchCountry';


const DEBOUNCE_DELAY = 300;


const searchCountry = document.querySelector('input');

searchCountry.addEventListener('input', debounce((event) => {
    const countryName = event.target.value.trim()
    
    console.log(countryName === "")
    if (countryName !== "") {
       API.fetchCountry(countryName).then(countries => {

           if (countries.length >= 20) {
            document.querySelector('.country-list').innerHTML = "";
            Notify.info('Too many matches found. Please enter a more specific name.');
            return
           } 
           
           document.querySelector('.country-info').innerHTML = "";
      
        const markup = countries
            .map(countries =>            
                `<div class="countries__list">
                    <img width= 100px src=${countries.flags.svg} alt='${countries.name}'>
                    <h2 class="countries__names">${countries.name.official}</h2>      
                </div>`)
            .join("")
            
        document.querySelector('.country-list').innerHTML = markup;
      
        
        
             
        if (countries.length === 1) {
            document.querySelector('.country-info').innerHTML = "";

            const card = `
            <p> Capital: ${countries[0].capital} </p>
            <p> Population: ${countries[0].population} </p>
            <p> Languages: ${Object.values(countries[0].languages)} </p>
            `
            // console.log(markup) 
            document.querySelector('.country-info').innerHTML = card;
        } 
        
    
        
    
    })        .catch(error => {
        console.log('error');
        document.querySelector('.country-info').innerHTML = "";
        Notify.failure('Oops, there is no country with that name')
    }) 
    }

    

       
}, DEBOUNCE_DELAY)) 

