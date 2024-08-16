const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const multer = require('multer');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Function to generate a random username
const generateUsername = () => {
    const adjectives = ['Brave', 'Clever', 'Witty', 'Bold', 'Mysterious'];
    const animals = ['Tiger', 'Eagle', 'Fox', 'Wolf', 'Hawk'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(Math.random() * 1000);

    return `${randomAdjective}${randomAnimal}${randomNumber}`;
};

app.get('/', (req, res) => {
    res.render('chat');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

io.on('connection', (socket) => {
    const username = generateUsername();
    console.log(`${username} connected`);

    io.emit('chat message', `${username} has joined the chat`);

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${username}: ${msg}`);
    });

    socket.on('file upload', (filePath) => {
        io.emit('file upload', { username, filePath });
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected`);
        io.emit('chat message', `${username} has left the chat`);
    });
});

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
