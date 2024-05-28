// Diese Elemente will ich immer wieder verwenden
// querySelector() -> #gibt für id und . für class
const body = document.querySelector('body');
let url = 'https://api.sunrise-sunset.org/json?lat=46.94798&lng=7.44743&date=today&tzid=Europe/Zurich&formatted=0';
let tzid = 'Europe/Zurich';
const select = document.querySelector('#stadtSuche');

const sonnenbogen = document.getElementById('sonnenbogen');

// Daten aus der API holen
async function fetchData(url, tzid) {
    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.results) {
            document.querySelector('#zeitLinks').textContent = `${data.results.sunrise}`.slice(11, 16);
            document.querySelector('#zeitRechts').textContent = `${data.results.sunset}`.slice(11, 16);
            document.querySelector('#currentTime').textContent = moment().tz(`${tzid}`).format('HH:mm');
        }
        console.log(data);
        return data;

    }
    catch (error) {
        console.log(error);
    }
}
fetchData(url, tzid);

// Mögliche Städte mit ihren Koordinaten und Zeitzonen
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
    select.addEventListener('change', async function () {
        let stadt = staedte.find(stadt => stadt.name === select.value);
        let url = `https://api.sunrise-sunset.org/json?lat=${stadt.lat}&lng=${stadt.lng}&date=today&tzid=${stadt.tzid}&formatted=0`;
        let tzid = stadt.tzid;
        await fetchData(url, tzid);
        angleSunAndRadius(url);
    });
});

updateCurrentTime(); // Aktuelle Zeit am Ort darstellen
setInterval(updateCurrentTime, 1000); // Aktualisierung der Zeit jede Sekunde

// Aktuelle Zeit am Ort holen
function updateCurrentTime() {
    const stadt = staedte.find(stadt => stadt.name === select.value);
    document.querySelector('#currentTime').textContent = moment().tz(`${stadt.tzid}`).format('HH:mm');
}

// Winkel und Radius berechnen
async function angleSunAndRadius(url) {
    const radius = sonnenbogen.getBoundingClientRect().width / 2; // Radius des Kreises berechnen

    try {
        let response = await fetch(url);
        let data = await response.json();
        if (data.results) {
            const sunrise = new Date(data.results.sunrise);
            const dayLength = new Date(data.results.day_length) / 60; // Länge des Tages in Minuten
            const now = new moment().tz('Europe/Zurich');

            const elapsedMinutes = (now - sunrise) / (1000 * 60); // Vergangene Minuten seit Sonnenaufgang
            const percentage = (elapsedMinutes / dayLength) * 100; // Prozentsatz des vergangenen Tages

            const angleSun = (percentage * 1.8) - 180; // Umrechnung in Grad (360 Grad / 200% = 1.8 Grad pro %)
            console.log(angleSun + 180);
            moveSonne(angleSun, radius);
            moveMond(angleSun, radius);
            visualChange(angleSun);
        }
    }
    catch (error) {
        console.log(error);
    }
}
angleSunAndRadius(url);

// Funktion, um die Verschiebung basierend auf der Bildschirmgröße zu bestimmen
function getShiftValues() {
    if (window.matchMedia("(max-width: 768px) and (min-width: 601px)").matches) {
        return { shiftX: -30, shiftY: 60 };
    } else if (window.matchMedia("(max-width: 600px) and (min-width: 451px)").matches) {
        return { shiftX: -25, shiftY: 50 };
    } else if (window.matchMedia("(max-width: 450px)").matches) {
        return { shiftX: -25, shiftY: 50 };
    } else {
        // Standardwerte für die Verschiebung
        return { shiftX: -40, shiftY: 85 };
    }
}

// Funktion, um ein Himmelskörper zu bewegen
function moveHimmelskoerper(angle, radius, element) {
    const radians = angle * Math.PI / 180; // Umrechnung von Grad in Radian
    const { shiftX, shiftY } = getShiftValues();
    const x = (sonnenbogen.getBoundingClientRect().width / 2 + radius * Math.cos(radians)) + shiftX;
    const y = (sonnenbogen.getBoundingClientRect().height / 2 + radius * Math.sin(radians)) + shiftY;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
}

// Funktion, um die Sonne zu bewegen
function moveSonne(angleSun, radius) {
    moveHimmelskoerper(angleSun, radius, sonne);
}

// Funktion, um den Mond zu bewegen
function moveMond(angleSun, radius) {
    let angleMond = angleSun - 180;
    moveHimmelskoerper(angleMond, radius, mond);
}

// Veränderungen Hintergrund bei Sonnenauf/-untergang, Tag und Nacht
async function visualChange(angleSun) {
    angleSun = angleSun + 180;

    // Sonnenaufgang
    if (angleSun < 10 && angleSun > -10) {
        body.style.background = 'linear-gradient(180deg, #FFEB3B 0%, #F29C6B 50%, #BF5A75 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }

    // Sonnenuntergang
    else if (angleSun > 170 && angleSun < 190) {
        body.style.background = 'linear-gradient(180deg, #E8E172 0%, #FFA338 50%, #E83331 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }

    // Tag
    else if (angleSun > 10 && angleSun < 170) {
        body.style.background = 'linear-gradient(180deg, #0669BF 0%, #5EBAF2 50%, #99D9F2 100%)';
        body.classList = '';
        sonne.style.display = 'block';
        mond.style.display = 'none'
    }

    // Nacht
    else {
        body.style.background = 'linear-gradient(180deg, #02070D 0%, #122A40 50%, #193B59 100%)';
        body.classList = '';
        body.classList.add('night');
        sonne.style.display = 'none';
        mond.style.display = 'block'
        try {
            let response = await fetch(url);
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