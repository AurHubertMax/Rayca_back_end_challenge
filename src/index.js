const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('../routes/authRoute');
const mongoose = require('mongoose');
const { protectedRoute } = require('../middleware/protectedRoute');
const { checkUser } = require('../middleware/checkUser');


const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

app.use(express.static("public"));

//routes
app.get("*", checkUser)
app.use(authRoute);
app.get('/*', protectedRoute);

const dbURI = ''
const port = 3000;

mongoose.connect(dbURI)
    .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
    })
    .catch((err) => {
    console.log('Error connecting to the database');
    });
