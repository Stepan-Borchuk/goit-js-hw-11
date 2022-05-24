const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountry(countryName) {
    return fetch(`${BASE_URL}/name/${countryName}?fields=name,capital,population,flags,languages`)
        .then(response => {
            // console.log(response.status)
            if (response.status === 404) {
                reject(error)
            } else {return response.json()}  
        })
 
}
  

export default { fetchCountry };