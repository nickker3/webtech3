// Oorspronkelijke fetch opslaan
const originalFetch = window.fetch;

// Nieuwe fetch-functie overbelasten
window.fetch = async (url, options = {}) => {
    // Haal de JWT-token op uit localStorage
    const token = localStorage.getItem("authToken");

    // Voeg de Authorization-header toe als er een token is
    if (token) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        };
    }

    try {
        // Roep de originele fetch aan met de aangepaste headers
        const response = await originalFetch(url, options);

        // Controleer of de token verlopen is (401 Unauthorized)
        if (response.status === 401) {
            alert("Je sessie is verlopen. Log opnieuw in.");
            localStorage.removeItem("authToken"); // Verwijder het token
            window.location.href = "login.html";  // Stuur gebruiker terug naar loginpagina
        }

        return response;
    } catch (error) {
        console.error("Fout bij API-aanroep:", error);
        return Promise.reject(error);
    }
};

// Controleer bij laden van de pagina of een token bestaat
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("authToken")) {
        alert("Je bent niet ingelogd. Log opnieuw in.");
        window.location.href = "login.html";
    }
});
