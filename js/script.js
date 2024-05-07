// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const body = document.querySelector('body');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';
let formattedUrl = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';


// Daten aus einer API holen
async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);

        let sonnenaufgang = moment(data.results.sunrise).tz('Europe/Zurich').format('LT');
        let sonnenuntergang = moment(data.results.sunset).tz('Europe/Zurich').format('LT');

        if (data.results) {
            document.querySelector('#sunriseTime').textContent = `${sonnenaufgang}`;
            document.querySelector('#sunsetTime').textContent = `${sonnenuntergang}`;
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
    tzid: 'Africa/Kampala'
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
        let url = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}&formatted=0`;
        let formattedUrl = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}&formatted=0`;
        await fetchData(url);

        position();
    });
});

updateCurrentTime(); // Rufen Sie diese Funktion auf, um die aktuelle Zeit sofort zu setzen
setInterval(updateCurrentTime, 1000);

function updateCurrentTime() {
    const select = document.querySelector('#stadt_suche');
    const stadt = staedte.find(stadt => stadt.name === select.value);
    document.querySelector('#currentTime').textContent = moment().tz(stadt.tzid).format('LT');
}

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
                const now = new moment().tz('America/Los_Angeles');
                
                const totalMinutes = (sunset - sunrise) / (1000 * 60); // Gesamte Minuten zwischen Sonnenaufgang und Sonnenuntergang
                const elapsedMinutes = (now - sunrise) / (1000 * 60); // Vergangene Minuten seit Sonnenaufgang
                const percentage = (elapsedMinutes / totalMinutes) * 100; // Prozentsatz des vergangenen Tages
                
                const angle = (percentage * 1.8) - 180; // Umrechnung in Grad (360 Grad / 200% = 1.8 Grad pro %)
                console.log(angle+180);
                moveSonne(angle);
                dawn(angle);
            })
            .catch(error => console.error('Error fetching sun position:', error));


    // Funktion, um die Sonne zu bewegen
    function moveSonne(angle) {
        const radians = angle * Math.PI / 180; // Umrechnung von Grad in Radian
        const x = (sonnenbogen.offsetWidth / 2 + radius * Math.cos(radians) )- 25;
        const y = (sonnenbogen.offsetHeight / 2 + radius * Math.sin(radians) )+ 85;
        sonne.style.left = `${x}px`;
        sonne.style.top = `${y}px`;
    } moveSonne(180);

    function dawn(angle) {
        angle = angle + 180;
        if (angle < 10 || angle > 170) {
            body.style.background = 'linear-gradient(180deg, #FFC107 0%, #FFEB3B 50%, #FFEB3B 100%)';
        } else {
            body.style.background = 'linear-gradient(180deg, #0669BF 0%, #5EBAF2 50%, #99D9F2 100%)';
        }        
    };
}
position();