const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Options Added
const corsOptions = {
    origin: ["http://localhost:3000", "https://your-deployed-frontend.com"],
    methods: ["GET", "POST"],
};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('sendMessage', async (data) => {
        const { sender, text, chatRoom } = data;
        const message = new Message({ sender, text, chatRoom });
        await message.save();
        io.to(chatRoom).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
