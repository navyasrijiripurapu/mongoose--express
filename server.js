import express from "express";

const app = express();

app.use(express.json());

// MOCK DATABASE
let movies = [
    {
        _id: "1",
        title: "Inception",
        director: "Christopher Nolan",
        genre: "Sci-Fi",
        year: 2010
    },
    {
        _id: "2",
        title: "Interstellar",
        director: "Christopher Nolan",
        genre: "Sci-Fi",
        year: 2014
    },
    {
        _id: "3",
        title: "The Dark Knight",
        director: "Christopher Nolan",
        genre: "Action",
        year: 2008
    },
    {
        _id: "4",
        title: "Titanic",
        director: "James Cameron",
        genre: "Romance",
        year: 1997
    },
    {
        _id: "5",
        title: "Avatar",
        director: "James Cameron",
        genre: "Adventure",
        year: 2009
    }
];

// Generate mock IDs
let nextId = 6;

// HOME ROUTE
// HOME ROUTE
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Movies API is running successfully!",
        status: "success",
        endpoints: {
            getAllMovies: "GET /api/v1/movies",
            getMovieById: "GET /api/v1/movies/:id",
            createMovie: "POST /api/v1/movies",
            updateMovie: "PUT /api/v1/movies/:id",
            deleteMovie: "DELETE /api/v1/movies/:id"
        }
    });
});

// CREATE MOVIE
app.post("/api/v1/movies", (req, res) => {
    const { title, director, genre, year } = req.body;

    if (!title || !genre || !year) {
        return res.status(400).json({
            message: "Title, genre, and year are required"
        });
    }

    if (!Number.isInteger(Number(year))) {
        return res.status(400).json({
            message: "Year must be a valid number"
        });
    }

    const newMovie = {
        _id: String(nextId++),
        title,
        director: director || "",
        genre,
        year: Number(year)
    };

    movies.push(newMovie);

    res.status(201).json({
        message: "Movie created successfully",
        data: newMovie
    });
});

// GET ALL MOVIES / FILTER BY GENRE
app.get("/api/v1/movies", (req, res) => {
    const { genre } = req.query;

    const result = genre
        ? movies.filter(movie =>
            movie.genre.toLowerCase() === genre.toLowerCase()
        )
        : movies;

    res.status(200).json({
        message: "Movies fetched successfully",
        data: result
    });
});

// GET MOVIE BY ID
app.get("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;

    const movie = movies.find(movie => movie._id === id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found"
        });
    }

    res.status(200).json({
        message: "Movie fetched successfully",
        data: movie
    });
});

// UPDATE MOVIE
app.put("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    const { title, director, genre, year } = req.body;

    const index = movies.findIndex(movie => movie._id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Movie not found"
        });
    }

    if (!title || !genre || !year) {
        return res.status(400).json({
            message: "Title, genre, and year are required"
        });
    }

    if (!Number.isInteger(Number(year))) {
        return res.status(400).json({
            message: "Year must be a valid number"
        });
    }

    const updatedMovie = {
        _id: id,
        title,
        director: director || "",
        genre,
        year: Number(year)
    };

    movies[index] = updatedMovie;

    res.status(200).json({
        message: "Movie updated successfully",
        data: updatedMovie
    });
});

// DELETE MOVIE
app.delete("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;

    const index = movies.findIndex(movie => movie._id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Movie not found"
        });
    }

    const deletedMovie = movies[index];

    movies.splice(index, 1);

    res.status(200).json({
        message: "Movie deleted successfully",
        data: deletedMovie
    });
});

// 404 MIDDLEWARE
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal Server Error"
    });
});

// VERCEL EXPORT
export default app;