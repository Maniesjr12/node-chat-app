const express = require('express');
const app =  express();
const http = require('http')
const path = require('path')
const {Server} = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, getLocation} = require('./utils/messages.js');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js');



const port = process.env.PORT || 3000;

const server = http.createServer(app)

const publicDir = path.join(__dirname, '../public')


const io = new  Server(server);
app.set('view engine', 'hbs');


app.use(express.static(publicDir))

// app.get('', (req, res)=>{
//     res.render('index');
// })
io.on('connection', (socket) => {
    console.log('a user connected');

    // rooms
    socket.on('joinRoom', ({username, room}, callBack)=>{
       const {error, user} = addUser( {id: socket.id, username, room} )
        if(error){
            return callBack(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('welcome to my chat app', 'Admin'));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} joined`, 'Admin'))
       
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        } )
        callBack()
    } )


    //  user message event
    socket.on('sentMessage', (message, callBack)=>{
        const  user  = getUser( socket.id)
        if(user){
            const filter = new Filter();
        if(filter.isProfane(message)){
            return callBack('message not delivered because it contains profanity ')
        }
        io.to(user.room).emit('message', generateMessage( message,user.username))
        callBack('Delivered')
        }
        
    })
    // user location event
    socket.on('userLocation', (location, callBack )=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('sendUserLocation', getLocation(user.username ,`https://www.google.com/maps/?q=${location.latitude},${location.longitude}`));
        callBack()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){

            io.to(user.room).emit('message', generateMessage(`${user.username} has left `))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            } )
        }
    })
  });
  
server.listen(port, ()=>{
    console.log(`server running on ${port}` )
}) 
