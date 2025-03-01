document.addEventListener("DOMContentLoaded", async function() {
    const lat = 69.6496; // Tromsø
    const lon = 18.9560;

    async function fetchWeatherData() {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url, { headers: { "User-Agent": "EzyMelt/1.0" } });
            const data = await response.json();
            const temp = data.properties.timeseries[0].data.instant.details.air_temperature;
            const precipitation = data.properties.timeseries[0].data.next_1_hours.details.precipitation_amount;
            document.getElementById("weather-info").innerText = `Temperatur: ${temp}°C | Nedbør: ${precipitation} mm`;
        } catch (error) {
            document.getElementById("weather-info").innerText = "Kunne ikke hente værdata.";
        }
    }

    async function fetchAnleggData() {
        try {
            const response = await fetch("/api/anlegg");
            const anlegg = await response.json();
            const anleggList = document.getElementById("anleggList");
            anlegg.forEach(a => {
                let li = document.createElement("li");
                li.innerText = `${a.name} - ${a.status} | ${a.effekt} kW`;
                anleggList.appendChild(li);
            });
        } catch (error) {
            console.error("Feil ved henting av anlegg:", error);
        }
    }

    fetchWeatherData();
    fetchAnleggData();
});