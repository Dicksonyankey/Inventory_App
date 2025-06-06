const mongoose = require('mongoose');

const connect_database = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch(err){
        console.error(err);
        console.log('MongoDB connection failed');
        process.exit(1);
    }
}

module.exports = connect_database;