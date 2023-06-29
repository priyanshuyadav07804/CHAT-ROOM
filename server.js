const path = require('path');
const http = require('http')
const cors = require('cors')
const express = require('express');
const {Server} = require("socket.io")
const app = express();
app.use(cors());

const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require('./utils/users')


const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"https://chat-room-two-ebon.vercel.app/",
        methods:["GET","POST"],
    }
})

const botName = 'ChatCord Bot'

//Set static folder
// app.use(path,callback function)->path pr jane se phle middleware callback function check krega
// express.static(root) -> to serve static files at root directory i.e. image,css,js file 
// path.join(path1,path2) -> to join different different path to one
app.use(express.static(path.join(__dirname, 'public')))

//run when a client connect
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)


        //when a new User come
        socket.emit('message', formatMessage(botName, 'welcome to chat code!')) //for single client

        //BroadCast when a user connects, for all except new user to specific room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has join the chat`));

        //Send user and Room Info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUser(user.room)
        })

    })


    //Listen for chatMessage then again send to braodcast
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    //Runs when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`)) //bradcast to everyone
            
            //Send user and Room Info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUser(user.room)
            })
        }
    })

})

const PORT = 3000 || process.env.PORT


server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

