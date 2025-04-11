require('dotenv').config();
const express = require('express');
app = express();

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const connect_database = require('./database/db');




// Make the Mongo DB connect over here
connect_database();


// Make use of all middleware
app.use(express.json());


// All the Routes Goes Here

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})