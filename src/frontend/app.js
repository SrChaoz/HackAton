// URL base del servidor (puedes cambiarla si es diferente)
const BASE_URL = "http://localhost:3000";

// Función para obtener datos del ranking de películas
async function fetchRankingData() {
    try {
        // Realiza la solicitud al backend
        const response = await fetch(`${BASE_URL}/movies/decade-ranking`);
        
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los datos del servidor.");
        }

        // Convierte los datos a JSON
        const data = await response.json();

        // Renderiza los datos en la tabla
        renderRankingData(data);
    } catch (error) {
        console.error("Error:", error.message);
        const rankingDataElement = document.getElementById("ranking-data");
        rankingDataElement.innerHTML = `<tr><td colspan="4">Error al cargar los datos. Intenta nuevamente más tarde.</td></tr>`;
    }
}

// Función para renderizar los datos en la tabla
function renderRankingData(data) {
    const rankingDataElement = document.getElementById("ranking-data");

    // Verifica si hay datos
    if (data.length === 0) {
        rankingDataElement.innerHTML = `<tr><td colspan="4">No se encontraron datos.</td></tr>`;
        return;
    }

    // Genera las filas de la tabla dinámicamente
    rankingDataElement.innerHTML = data
        .map(movie => `
            <tr>
                <td>${movie.decade}</td>
                <td>${movie.title}</td>
                <td>${movie.oscars}</td>
                <td>${movie.nominations}</td>
            </tr>
        `)
        .join(""); // Convierte el array en un string con las filas
}

// Ejecuta la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchRankingData);
