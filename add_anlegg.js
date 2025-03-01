document.getElementById("anleggForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const anlegg = {
        name: document.getElementById("name").value,
        lat: parseFloat(document.getElementById("lat").value),
        lon: parseFloat(document.getElementById("lon").value),
        status: document.getElementById("status").value,
        effekt: parseFloat(document.getElementById("effekt").value)
    };

    try {
        const response = await fetch("/api/anlegg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(anlegg)
        });

        if (response.ok) {
            alert("Anlegg lagret!");
            window.location.href = "/";
        } else {
            alert("Feil ved lagring.");
        }
    } catch (error) {
        console.error("Feil ved lagring av anlegg:", error);
        alert("Kunne ikke lagre anlegg.");
    }
});