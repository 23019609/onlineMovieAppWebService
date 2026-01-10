// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
}

// intialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

// allmovies route
app.get('/allmovies', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.movies');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allmovies'});
    }
});

// addmovie route
app.post('/addmovie', async(req, res) => {
    const {movie_name, movie_year, movie_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO movies (movie_name, movie_year, movie_pic) VALUES (?, ?, ?)', [movie_name, movie_year, movie_pic]);
        res.status(201).json({message: 'Movie ' + movie_name + ' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add movie ' + movie_name});
    }
})

// updatemovie route
app.post('/updatemovie', async(req, res) => {
    const {id, movie_name, movie_year, movie_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        // example update sql
        // UPDATE Customers SET ContactName = 'Alfred Schmidt', City= 'Frankfurt' WHERE CustomerID = 1
        await connection.execute('UPDATE movies SET (movie_name, movie_year, movie_pic) VALUES (?, ?, ?) WHERE id = id', [id, movie_name, movie_year, movie_pic]);
        res.status(201).json({message: 'Movie ' + movie_name + ' updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not update movie ' + movie_name});
    }
})

// deletemovie route using get
app.get(`/deletemovie/${id}`, async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('DELETE FROM movies WHERE id = id VALUES (?)', [id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete movie using get ' + movie_name});
    }
});

// deletemovie route using post
app.post('/deletemovie', async(req, res) => {
    const {id} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        // example delete sql
        // DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste'
        await connection.execute('DELETE FROM movies WHERE id = id VALUES (?)', [id]);
        res.status(201).json({message: 'Movie ' + movie_name + ' deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete movie using post ' + movie_name});
    }
})