// URL base del servidor (puedes cambiarla si es diferente)
const BASE_URL = "http://localhost:3000";

// Función para obtener datos del ranking de películas
async function fetchRankingData() {
    try {
        // Realiza la solicitud al backend
        const response = await fetch(`${BASE_URL}/peliculas/decade-ranking`);
        
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



// Función para obtener y renderizar el promedio de duración
async function fetchPromedioDuracion() {
    try {
        // Solicitar los datos al servidor
        const response = await fetch(`${BASE_URL}/peliculas/average-duration`);

        if (!response.ok) {
            throw new Error("Error al obtener los datos del servidor");
        }

        // Parsear la respuesta como JSON
        const data = await response.json();
        console.log(data); // Verifica los datos recibidos

        // Seleccionar el cuerpo de la tabla
        const promedioDuracionTableBody = document.getElementById("promedio-duracion-data");

        // Limpiar la tabla antes de llenarla
        promedioDuracionTableBody.innerHTML = "";

        // Recorrer los datos y generar las filas de la tabla
        data.forEach((row) => {
            console.log(row); // Verifica cada fila
            const tr = document.createElement("tr");

            const yearCell = document.createElement("td");
            yearCell.textContent = row.year;

            const avgDurationCell = document.createElement("td");
            avgDurationCell.textContent = row.avg_duration;

            tr.appendChild(yearCell);
            tr.appendChild(avgDurationCell);

            promedioDuracionTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);

        // Mostrar mensaje de error en la tabla
        const promedioDuracionTableBody = document.getElementById("promedio-duracion-data");
        promedioDuracionTableBody.innerHTML = `
            <tr>
                <td colspan="2" style="text-align: center; color: red;">Error al cargar los datos</td>
            </tr>
        `;
    }
}

async function fetchDirectorsData() {
    try {
        // Realiza la solicitud al backend
        const response = await fetch(`${BASE_URL}/peliculas/top-directors`);
        
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los datos del servidor.");
        }

        // Convierte los datos a JSON
        const data = await response.json();

        // Renderiza los datos en la tabla
        renderDirectorsData(data);
    } catch (error) {
        console.error("Error:", error.message);
        const DirectorsElement = document.getElementById("directores-data");
        DirectorsElement.innerHTML = `<tr><td colspan="4">Error al cargar los datos. Intenta nuevamente más tarde.</td></tr>`;
    }
}

// Función para renderizar los datos en la tabla
function renderDirectorsData(data) {
    const DirectorsElement = document.getElementById("directores-data");

    // Verifica si hay datos
    if (data.length === 0) {
        DirectorsElement.innerHTML = `<tr><td colspan="4">No se encontraron datos.</td></tr>`;
        return;
    }

    // Genera las filas de la tabla dinámicamente
    DirectorsElement.innerHTML = data
        .map(movie => `
            <tr>
                <td>${movie.director}</td>
                <td>${movie.movie_count}</td>
            </tr>
        `)
        .join(""); // Convierte el array en un string con las filas
}

document.addEventListener("DOMContentLoaded", fetchDirectorsData);

// Ejecutar la función cuando el contenido esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const promedioDuracionTableBody = document.getElementById("promedio-duracion-data");

    if (promedioDuracionTableBody) {
        fetchPromedioDuracion();
    }
});
