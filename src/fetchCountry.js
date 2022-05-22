const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountry(countryName) {
    return fetch(`${BASE_URL}/name/${countryName}?fields=name,capital,population,flags,languages`)
        .then(response => response.json())
}
  

export default { fetchCountry };

//   fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`)
//         .then(responce => { return responce.json() })