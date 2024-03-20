import express from 'express';
import {Server} from 'socket.io'
import {createServer} from 'http';
import cors from 'cors'
const port=3000;
const app=express();
const server=createServer(app);
const users={};

const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true,
  }
});

io.on('connection',socket=>{

  // if any new user joins, let other users connected to server know!
  socket.on('new-user-joined',name=>{
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
  })


  //if someone sends message, broadcast it to other people
  socket.on('send',message=>{
    socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
  })


  //if someone leaves the chat, let others know
  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
  })
})


app.get('/',(req,res)=>{
  res.send("<h1>I am SERVER</h1>");
})


server.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})