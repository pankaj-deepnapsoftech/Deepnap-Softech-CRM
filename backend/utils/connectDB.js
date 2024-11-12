const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log("DB connected successfully!!!")
    }
    catch(err){
        console.log("Something went wrong...", err.message);
        process.exit(0);
    }
}

module.exports = connectDB;