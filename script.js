document.addEventListener("DOMContentLoaded", async function() {
    const lat = 69.6496; // Tromsø
    const lon = 18.9560;
    let weatherChartInstance = null;
    let precipitationChartInstance = null;

    async function fetchWeatherData() {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url, { headers: { "User-Agent": "EzyMelt/1.0" } });
            const data = await response.json();

            // Hente temperatur og nedbør
            const temp = data.properties.timeseries[0].data.instant.details.air_temperature;
            const precipitation = data.properties.timeseries[0].data.next_1_hours.details.precipitation_amount;

            document.getElementById("weather-info").innerText = `Temperatur: ${temp}°C | Nedbør: ${precipitation} mm`;

            // Hent timebasert nedbørsdata for 24 timer fremover
            let labels = [];
            let precipitationData = [];
            for (let i = 1; i <= 24; i++) {
                const timeEntry = data.properties.timeseries[i];
                if (timeEntry && timeEntry.data.next_1_hours) {
                    labels.push(timeEntry.time.substring(11, 16)); // Klokkeslett
                    precipitationData.push(timeEntry.data.next_1_hours.details.precipitation_amount);
                }
            }

            updateChart("weatherChart", "Temperatur", ["Nå"], [temp], "orange");
            updateChart("precipitationChart", "Nedbør (mm)", labels, precipitationData, "blue");

        } catch (error) {
            document.getElementById("weather-info").innerText = "Kunne ikke hente værdata.";
            console.error("Feil ved henting av værdata:", error);
        }
    }

    function updateChart(canvasId, label, labels, data, color) {
        const ctx = document.getElementById(canvasId).getContext("2d");
        if (!ctx) return;

        if (canvasId === "weatherChart" && weatherChartInstance) weatherChartInstance.destroy();
        if (canvasId === "precipitationChart" && precipitationChartInstance) precipitationChartInstance.destroy();

        const chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: color,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0, max: Math.max(...data) + 2 }
                }
            }
        });

        if (canvasId === "weatherChart") weatherChartInstance = chartInstance;
        if (canvasId === "precipitationChart") precipitationChartInstance = chartInstance;
    }

    async function fetchAnleggData() {
        try {
            const response = await fetch("/api/anlegg");
            if (!response.ok) throw new Error("Kunne ikke hente anleggsliste");
            
            const anlegg = await response.json();

            const anleggList = document.getElementById("anleggList");
            anleggList.innerHTML = ""; // Rens listen før oppdatering

            const map = L.map("map").setView([lat, lon], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            }).addTo(map);

            anlegg.forEach(a => {
                let li = document.createElement("li");
                li.innerText = `${a.name} - ${a.status} | ${a.effekt} kW`;
                anleggList.appendChild(li);

                L.marker([a.lat, a.lon]).addTo(map).bindPopup(`<b>${a.name}</b><br>Status: ${a.status}<br>Effekt: ${a.effekt} kW`);
            });
        } catch (error) {
            console.error("Feil ved henting av anlegg:", error);
            document.getElementById("anleggList").innerText = "Kunne ikke laste anlegg.";
        }
    }

    fetchWeatherData();
    fetchAnleggData();
});
