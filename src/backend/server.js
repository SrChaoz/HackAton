const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: "postgres", // Cambia por tu usuario de PostgreSQL
  host: "localhost",
  database: "hackaton", // Cambia por el nombre de tu base de datos
  password: "postgres", // Cambia por tu contraseña
  port: 5432,
});

// Endpoint para obtener todas las películas
app.get("/peliculas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM peliculas");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener películas");
  }
});

// Endpoint para agregar una nueva película
app.post("/peliculas", async (req, res) => {
  const {
    id,
    title,
    year,
    duration,
    mpa,
    rating,
    votes,
    budget,
    gross_worldwide,
    gross_us_canada,
    opening_weekend_gross,
    directors,
    writers,
    stars,
    genres,
    countries_origin,
    filming_locations,
    production_companies,
    languages,
    wins,
    nominations,
    oscars,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO peliculas (
        id, title, year, duration, mpa, rating, votes, budget, gross_worldwide, 
        gross_us_canada, opening_weekend_gross, directors, writers, stars, genres, 
        countries_origin, filming_locations, production_companies, languages, wins, 
        nominations, oscars
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
        $18, $19, $20, $21, $22
      ) RETURNING *`,
      [
        id,
        title,
        year,
        duration,
        mpa,
        rating,
        votes,
        budget,
        gross_worldwide,
        gross_us_canada,
        opening_weekend_gross,
        directors,
        writers,
        stars,
        genres,
        countries_origin,
        filming_locations,
        production_companies,
        languages,
        wins,
        nominations,
        oscars,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al agregar película");
  }
});

// Endpoint para ranking de películas con más Oscars y nominaciones por década
app.get("/peliculas/decade-ranking", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (year / 10) * 10 AS decade, 
        title, 
        oscars, 
        nominations, 
        (oscars + nominations) AS total_awards
      FROM peliculas
      WHERE oscars IS NOT NULL AND nominations IS NOT NULL
      ORDER BY decade ASC, total_awards DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener ranking de películas");
  }
});

// Endpoint para promedio de duración de películas por año
app.get("/peliculas/average-duration", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          year, 
          ROUND(AVG(
            CASE
              WHEN duration ~ '^[0-9]+h [0-9]+m$' THEN 
                (split_part(duration, 'h', 1)::NUMERIC * 60) + 
                split_part(split_part(duration, ' ', 2), 'm', 1)::NUMERIC
              WHEN duration ~ '^[0-9]+h$' THEN 
                split_part(duration, 'h', 1)::NUMERIC * 60
              WHEN duration ~ '^[0-9]+m$' THEN 
                split_part(duration, 'm', 1)::NUMERIC
              ELSE 
                NULL
            END
          ), 2) AS avg_duration
        FROM peliculas
        WHERE duration IS NOT NULL
        GROUP BY year
        ORDER BY year ASC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al obtener promedio de duración");
    }
  });
  

// Endpoint para directores con más películas
app.get("/peliculas/top-directors", async (req, res) => {
  try {
    const result = await pool.query(`
   SELECT 
      TRIM(BOTH ' ' FROM REPLACE(REPLACE(REPLACE(director, '[', ''), ']', ''), '''', '')) AS director, 
      COUNT(*) AS movie_count
      FROM (
      SELECT UNNEST(STRING_TO_ARRAY(directors, ',')) AS director
      FROM peliculas
      ) AS unnest_directors
    GROUP BY director
    ORDER BY movie_count DESC
    LIMIT 10;


    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener directores con más películas");
  }
});
app.get("/peliculas/filtro", async (req, res) => {
  try {
    const { like } = req.query; // Obtener el término de búsqueda desde los parámetros
    const result = await pool.query(
      `SELECT * FROM peliculas WHERE title ILIKE $1`,
      [`%${like}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al filtrar películas");
  }
});

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
