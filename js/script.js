// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const body = document.querySelector('body');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';
let formattedUrl = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';
let tzid = 'Europe/Zurich';


// Daten aus einer API holen
async function fetchData(url, tzid) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);

        if (data.results) {
            document.querySelector('#zeitLinks').textContent = `${data.results.sunrise}`.slice(11, 16);
            document.querySelector('#zeitRechts').textContent = `${data.results.sunset}`.slice(11, 16);
            document.querySelector('#currentTime').textContent = moment().tz(`${tzid}`).format('HH:mm');
        }

        return data;

    }
    catch (error) {
        console.log(error);
    }
}
fetchData(url, tzid);

let staedte = [
    {
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
    },
    {
        name: 'miami',
        lat: 25.7617,
        lng: -80.1918,
        tzid: 'America/New_York'
    },
    {
        name: 'dubai',
        lat: 25.276987,
        lng: 55.296249,
        tzid: 'Asia/Dubai'
    },
    {
        name: 'bangkok',
        lat: 13.7563,
        lng: 100.5018,
        tzid: 'Asia/Bangkok'
    },
    {
        name: 'taipeh',
        lat: 25.0330,
        lng: 121.5654,
        tzid: 'Asia/Taipei'
    },
    {
        name: 'marrakesch',
        lat: 31.6295,
        lng: -7.9811,
        tzid: 'Africa/Casablanca'
    }
];

// Änderungen der Stadt erkennen
document.addEventListener('DOMContentLoaded', function () {
    const select = document.querySelector('#stadt_suche');

    select.addEventListener('change', async function () {
        let stadt = staedte.find(stadt => stadt.name === select.value);
        let url = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}&formatted=0`;
        let formattedUrl = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}&formatted=0`;
        let tzid = stadt.tzid;
        await fetchData(url, tzid);
        angleSunAndRadius(formattedUrl);
    });
});

updateCurrentTime(); // Rufen Sie diese Funktion auf, um die aktuelle Zeit sofort zu setzen
setInterval(updateCurrentTime, 1000);

// Aktuelle Zeit am Ort darstellen
function updateCurrentTime() {
    const select = document.querySelector('#stadt_suche');
    const stadt = staedte.find(stadt => stadt.name === select.value);
    document.querySelector('#currentTime').textContent = moment().tz(`${stadt.tzid}`).format('HH:mm');
}

// Winkel und Radius berechnen
async function angleSunAndRadius(formattedUrl) {
    const sonnenbogen = document.getElementById('sonnenbogen');
    const radius = sonnenbogen.offsetWidth / 2; // Radius des Kreises berechnen

    try {
        let response = await fetch(formattedUrl);
        let data = await response.json();
        if (data.results) {
            const sunrise = new Date(data.results.sunrise);
            const sunset = new Date(data.results.sunset);
            const now = new moment().tz('Europe/Zurich');

            const totalMinutes = (sunset - sunrise) / (1000 * 60); // Gesamte Minuten zwischen Sonnenaufgang und Sonnenuntergang
            const elapsedMinutes = (now - sunrise) / (1000 * 60); // Vergangene Minuten seit Sonnenaufgang
            const percentage = (elapsedMinutes / totalMinutes) * 100; // Prozentsatz des vergangenen Tages

            const angleSun = (percentage * 1.8) - 180; // Umrechnung in Grad (360 Grad / 200% = 1.8 Grad pro %)
            console.log(angleSun + 180);
            moveSonne(angleSun, radius);
            moveMond(angleSun, radius)
            visualChange(angleSun);
        }
    }
    catch (error) {
        console.log(error);
    }
}
angleSunAndRadius(formattedUrl);

// Funktion, um die Sonne zu bewegen
function moveSonne(angleSun, radius) {
    const radians = angleSun * Math.PI / 180; // Umrechnung von Grad in Radian
    const x = (sonnenbogen.offsetWidth / 2 + radius * Math.cos(radians)) - 40;
    const y = (sonnenbogen.offsetHeight / 2 + radius * Math.sin(radians)) + 85;
    sonne.style.left = `${x}px`;
    sonne.style.top = `${y}px`;
} moveSonne(180);

//Funktion, um den Mond zu bewegen
function moveMond(angleSun, radius) {
    let angleMond = angleSun - 180
    const radians = angleMond * Math.PI / 180; // Umrechnung von Grad in Radian
    const x = (sonnenbogen.offsetWidth / 2 + radius * Math.cos(radians)) - 40;
    const y = (sonnenbogen.offsetHeight / 2 + radius * Math.sin(radians)) + 85;
    mond.style.left = `${x}px`;
    mond.style.top = `${y}px`;

}

// Veränderungen bei Sonnenauf/-untergang und Nacht
async function visualChange(angleSun) {
    angleSun = angleSun + 180;
    if (angleSun < 10 && angleSun > -10) {
        body.style.background = 'linear-gradient(180deg, #FFEB3B 0%, #FFEB3B 50%, #FFC107 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }
    else if (angleSun > 170 && angleSun < 190) {
        body.style.background = 'linear-gradient(180deg, #E8E172 0%, #FFA338 50%, #E83331 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }
    else if (angleSun > 10 && angleSun < 170) {
        body.style.background = 'linear-gradient(180deg, #0669BF 0%, #5EBAF2 50%, #99D9F2 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }
    else {
        body.style.background = 'linear-gradient(180deg, #02070D 0%, #122A40 50%, #193B59 100%)';
        body.classList = '';
        body.classList.add('night');
        sonne.style.display = 'none';
        mond.style.display = 'block'
        try {
            let response = await fetch(formattedUrl);
            let data = await response.json();
            if (data.results) {
                document.querySelector('#zeitRechts').textContent = `${data.results.sunrise}`.slice(11, 16);
                document.querySelector('#zeitLinks').textContent = `${data.results.sunset}`.slice(11, 16);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};