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
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener películas");
  }
});

// Endpoint para agregar una nueva película
app.post("/movies", async (req, res) => {
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
      `INSERT INTO movies (
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
app.get("/movies/decade-ranking", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (year / 10) * 10 AS decade, 
        title, 
        oscars, 
        nominations, 
        (oscars + nominations) AS total_awards
      FROM movies
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
app.get("/movies/average-duration", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        year, 
        ROUND(AVG(duration::NUMERIC), 2) AS avg_duration
      FROM movies
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
app.get("/movies/top-directors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        director, 
        COUNT(*) AS movie_count
      FROM (
        SELECT UNNEST(directors) AS director
        FROM movies
      ) AS unnest_directors
      GROUP BY director
      ORDER BY movie_count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener directores con más películas");
  }
});

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
