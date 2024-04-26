// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const staedte = document.querySelector('#stadt_suche');
const sonnenaufgang = document.querySelector('#sonnenaufgang');
const sonnenstand = document.querySelector('#sonnenstand');
const sonnenuntergang = document.querySelector('#sonnenuntergang');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today';

// // Initalisierung
// init();

// async function init() {
//     let cocktails = await fetchData(url);
//     console.log(cocktails.drinks[0].strDrink);
//     cocktails.drinks.forEach(cocktail => {
//         createItem(cocktail);
//     });
// };

// async function search() {
//     let searchValue = searchBox.value;
//     let url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`;
//     cocktailApp.innerHTML = '';
//     let cocktails = await fetchData(url);
//     console.log(cocktails.drinks[0].strDrink);
//     cocktails.drinks.forEach(cocktail => {
//         createItem(cocktail);
//     });

// }

// Daten aus einer API holen
async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

fetchData(url);