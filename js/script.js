// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const sonnenaufgang = document.querySelector('#sonnenaufgang');
const sonnenstand = document.querySelector('#sonnenstand');
const sonnenuntergang = document.querySelector('#sonnenuntergang');
const body = document.querySelector('body');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich';
let formattedUrl = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';


// Daten aus einer API holen
async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        console.log(data.results.day_length);

        if (data.results) {
            document.querySelector('#sunriseTime').textContent = `${data.results.sunrise}`;
            document.querySelector('#sunsetTime').textContent = `${data.results.sunset}`;
            document.querySelector('#currentTime').textContent = moment().tz('Europe/Zurich').format('LT');
        }

        return data;

    }
    catch (error) {
        console.log(error);
    }
}
fetchData(url);

let staedte = [{
    name: 'bern',
    lat: 46.94798,
    lng: 7.44743,
    tzid: 'Europe/Zurich'
},
{
    name: 'losangeles',
    lat: 34.052235,
    lng: -118.243683,
    tzid: 'America/Los_Angeles'
},
{
    name: 'tokio',
    lat: 35.652832,
    lng: 139.839478,
    tzid: 'Asia/Tokyo'
},
{
    name: 'kairo',
    lat: 30.033333,
    lng: 31.233334,
    tzid: 'Africa/Cairo'
},
{
    name: 'rio',
    lat: -22.908333,
    lng: -43.196388,
    tzid: 'America/Sao_Paulo'
}];

document.addEventListener('DOMContentLoaded', function () {
    const select = document.querySelector('#stadt_suche');

    select.addEventListener('change', async function () {
        let stadt = staedte.find(stadt => stadt.name === select.value);
        let url = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}`;
        await fetchData(url);
        document.querySelector('#currentTime').textContent = moment().tz(`${stadt.tzid}`).format('LT');
        console.log(stadt.tzid);
    });
});

function position() {
    const sonne = document.getElementById('sonne');
    const sonnenbogen = document.getElementById('sonnenbogen');

    const radius = sonnenbogen.offsetWidth / 2; // Radius des Kreises berechnen

    // Funktion, um den Sonnenstand von der API zu erhalten
        fetch(formattedUrl)
            .then(response => response.json())
            .then(data => {
                const sunrise = new Date(data.results.sunrise);
                const sunset = new Date(data.results.sunset);
                const now = new Date();
                
                const totalMinutes = (sunset - sunrise) / (1000 * 60); // Gesamte Minuten zwischen Sonnenaufgang und Sonnenuntergang
                const elapsedMinutes = (now - sunrise) / (1000 * 60); // Vergangene Minuten seit Sonnenaufgang
                const percentage = (elapsedMinutes / totalMinutes) * 100; // Prozentsatz des vergangenen Tages
                
                const angle = (percentage * 1.8) - 180; // Umrechnung in Grad (360 Grad / 200% = 1.8 Grad pro %)
                console.log(angle);
                moveSonne(angle);
                dawn(angle);
            })
            .catch(error => console.error('Error fetching sun position:', error));


    // Funktion, um die Sonne zu bewegen
    function moveSonne(angle) {
        const radians = angle * Math.PI / 180; // Umrechnung von Grad in Radian
        const x = (sonnenbogen.offsetWidth / 2 + radius * Math.cos(radians) )- 25;
        const y = (sonnenbogen.offsetHeight / 2 + radius * Math.sin(radians) )+ 100;
        sonne.style.left = `${x}px`;
        sonne.style.top = `${y}px`;
    } moveSonne(180);

    function dawn(angle) {
        if (angle + 180 < 10 || angle + 180 > 170) {
            body.style.background = 'linear-gradient(180deg, #FFC107 0%, #FFC107 50%, #FFEB3B 50%, #FFEB3B 100%)';
        } else {
            body.style.background = 'linear-gradient(180deg, #FFC107 0%, #FFEB3B 50%, #FFEB3B 100%)';
        }        
    };
}
position();