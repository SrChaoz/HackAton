// URL base del servidor 
const BASE_URL = "http://localhost:3000";

// Función para obtener datos del ranking de películas
function fetchSearchEngine() {
    const busqueda = document.getElementById("search-ranking").value; 
    fetch(`${BASE_URL}/peliculas/filtro?like=${encodeURIComponent(busqueda)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            renderRankingData(data); // Función para renderizar la tabla
        })
        .catch(error => console.error("Error:", error));
}
let debounceTimer;
function debounceFetchSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchSearchEngine, 300); 
}


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
        tbody.innerHTML = "";
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

        promedioDuracionTableBody.innerHTML = "";

        // Recorrer los datos y generar las filas de la tabla
        data.forEach((row) => {
            console.log(row); 
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

//funcion para obtener datos de directores
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

// Función para renderizar los datos de directores en la tabla
function renderDirectorsData(data) {
    const DirectorsElement = document.getElementById("directores-data");

    // Verifica si hay datos
    if (data.length === 0) {
        DirectorsElement.innerHTML = `<tr><td colspan="4">No se encontraron datos.</td></tr>`;
        return;
    }

    // Genera las filas de la tabla dinámicamente
    DirectorsElement.innerHTML = data
        .map(director => `
            <tr>
                <td>${director.director}</td>
                <td>${director.movie_count}</td>
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


document.addEventListener("DOMContentLoaded", async () => {
    const ctx = document.getElementById("graficoIdiomas").getContext("2d");
  
    try {
      // Hacer la petición al backend para obtener los datos
      const response = await fetch("http://localhost:3000/peliculas/languages");
      const data = await response.json();
  
      // Procesar los datos para el gráfico
      const labels = data.map((row) => row.language);
      const movieCounts = data.map((row) => row.movie_count);
  
      // Crear el gráfico
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels, 
          datasets: [
            {
              label: "Número de Películas",
              data: movieCounts, 
              backgroundColor: [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#FF33A1",
                "#F1C40F",
                "#2ECC71",
                "#9B59B6",
                "#E74C3C",
                "#3498DB",
                "#95A5A6",
              ],
              borderColor: [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#FF33A1",
                "#F1C40F",
                "#2ECC71",
                "#9B59B6",
                "#E74C3C",
                "#3498DB",
                "#95A5A6",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Número de Películas",
              },
            },
            x: {
              title: {
                display: true,
                text: "Idiomas",
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error al cargar los datos del gráfico:", error);
    }
  });
  