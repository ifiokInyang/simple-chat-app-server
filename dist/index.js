"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"]
    }
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    //listening for the event "join_room" which is being emitted from the front end
    socket.on("join_room", (roomId) => {
        //This linne of code joins the user to the specified chat room with room id of droomId        
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} just joined the room with room ID: ${roomId}`);
    });
    //listening for the send message event emitted from the front end
    socket.on("send_message", (data) => {
        //emitting an event called "receive_message" with that data to those who joined the room using the room ID
        socket.to(data.room).emit("receive_message", data);
        console.log(data);
    });
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello my world"
    });
});
const PORT = process.env.PORT || 4432;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// app.listen(PORT, ()=>{
//     console.log(`Server running on http://localhost:${PORT}`)
// })
