const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


require("dotenv").config();

const userRoutes = require("./routes/userRoutes")
const garageRoutes = require("./routes/garageRoutes")
const app = express();
const port = process.env.PORT || 9000;

app.use(cors())

app.use('/public', express.static('public'));


app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', garageRoutes);

app.get('/', (req, res) => {
    res.send('Hola mundo Api')
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Conectado a la base de datos");

    })
    .catch((error) => console.error(error));




app.listen(port, () => console.log('Servidor escuchando en ', port))