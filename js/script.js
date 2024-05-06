// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const staedte = document.querySelector('#stadt_suche');
const sonnenaufgang = document.querySelector('#sonnenaufgang');
const sonnenstand = document.querySelector('#sonnenstand');
const sonnenuntergang = document.querySelector('#sonnenuntergang');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&';

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

document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById('slider');
    const sonne = document.getElementById('sonne');
    const sonnenbogen = document.getElementById('sonnenbogen');

    const radius = sonnenbogen.offsetWidth / 2; // Radius des Kreises berechnen

    slider.addEventListener('input', function() {
        const angle = parseInt(slider.value) - 180;
        moveSonne(angle);
    });

    function moveSonne(angle) {
        const radians = angle * Math.PI / 180; // Umrechnung von Grad in Radian
        const x = (sonnenbogen.offsetWidth / 2 + radius * Math.cos(radians) )- 25;
        const y = (sonnenbogen.offsetHeight / 2 + radius * Math.sin(radians) )+ 100;
        sonne.style.left = `${x}px`;
        sonne.style.top = `${y}px`;
    }

    // Initialposition
    moveSonne(180);
});
















































































async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.results) {
            document.querySelector('#sunriseTime').textContent = `Sonnenaufgang: ${data.results.sunrise}`;
            document.querySelector('#sunsetTime').textContent = `Sonnenuntergang: ${data.results.sunset}`;
        }

        return data;  // Diese Zeile bleibt innerhalb des try-Blocks
    } catch (error) {
        console.error(error);
    }
}

