import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("DB Connected");
        
    })

    await mongoose.connect(`${process.env.MONGODB_URL}?retryWrites=true&w=majority&appName=Cluster0`)

}

export default connectDB
