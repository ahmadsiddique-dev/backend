import mongoose from "mongoose";
 
const DBCon = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb://localhost:27017/ahmad")
        console.log("connection was successful", connectionInstance.connection.host)
    } catch (error) {
        console.log("This is the initial dbcon error AS : ", error)
    }
}

export {DBCon}