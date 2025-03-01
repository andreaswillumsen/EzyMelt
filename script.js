document.addEventListener("DOMContentLoaded", async function() {
    const lat = 69.6496; // Tromsø
    const lon = 18.9560;

    async function fetchWeatherData() {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url, {
                headers: { "User-Agent": "EzyMelt/1.0" }
            });
            const data = await response.json();

            const temp = data.properties.timeseries[0].data.instant.details.air_temperature;
            const precipitation = data.properties.timeseries[0].data.next_1_hours.details.precipitation_amount;

            document.getElementById("weather-info").innerText = `Temperatur: ${temp}°C | Nedbør: ${precipitation} mm`;
        } catch (error) {
            document.getElementById("weather-info").innerText = "Kunne ikke hente værdata.";
            console.error("Feil ved henting av værdata:", error);
        }
    }

    fetchWeatherData();

    const anlegg = [
        { name: "Storgata", status: "Aktiv", effekt: "15kW", forbruk24h: "60kWh", forbruk7d: "400kWh", lat: 69.6500, lon: 18.9500 },
        { name: "Havneterminalen", status: "Inaktiv", effekt: "0kW", forbruk24h: "0kWh", forbruk7d: "30kWh", lat: 69.6510, lon: 18.9550 }
    ];

    const anleggList = document.getElementById('anleggList');
    anlegg.forEach(a => {
        let li = document.createElement('li');
        li.innerText = `${a.name} - ${a.status} | ${a.effekt} | ${a.forbruk24h} siste 24t | ${a.forbruk7d} siste 7d`;
        anleggList.appendChild(li);
    });
});
