const mongoose = require('mongoose');

const connectDB = async () => {
    try{
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB : ${connect.connection.host}`);
    }catch(error){
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}


module.exports = connectDB;