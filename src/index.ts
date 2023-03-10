import express, {Request, Response} from "express";
import createHttpError from "http-errors";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config()





const app = express()

app.use(express.json())
app.use(logger("dev"))
app.use(cors())
app.use(cookieParser())

const server = http.createServer(app)


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"]
    }
})

io.on("connection", (socket)=>{
    console.log(`User connected: ${socket.id}`)

    //listening for the event "join_room" which is being emitted from the front end
    socket.on("join_room", (roomId) => {
        //This linne of code joins the user to the specified chat room with room id of droomId        
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} just joined the room with room ID: ${roomId}`)
    })

    //listening for the send message event emitted from the front end
    socket.on("send_message", (data) => {
        //emitting an event called "receive_message" with that data to those who joined the room using the room ID
        socket.to(data.room).emit("receive_message", data)
        console.log(data)
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id)
    })
})


app.get("/", (req: Request, res: Response)=>{
    return res.status(200).json({
        message: "Hello my world"
    })
})


const PORT = process.env.PORT || 4432
server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

// app.listen(PORT, ()=>{
//     console.log(`Server running on http://localhost:${PORT}`)
// })
