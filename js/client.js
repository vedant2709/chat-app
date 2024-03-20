const socket=io('http://localhost:3000/');

//get DOM elements in JS variables
const form =document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer= document.querySelector('.container');

//audio that will play on receiving messages
var audio=new Audio('ting.mp3');

//function which will append event info to the container
const append=(message,position)=>{
  const messageElement=document.createElement('div');
  messageElement.textContent=message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if(position=="left"){
    audio.play();
  }
}

//ask new user for his/her name and let the server know
const myname=prompt("enter your name : ");
socket.emit("new-user-joined",myname);

//if a new user joins, receive his/her name from server
socket.on("user-joined",name=>{
  append(`${name} joined the chat`,'right');
})


//if server sends a message , receive it
socket.on("receive",data=>{
  append(`${data.name} : ${data.message}`,'left')
})

//if user leaves the chat, append the info to container
socket.on('left',name=>{
  append(`${name} has left`,'right');
})

//if form gets submitted , send server the message
form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const message=messageInput.value;
  append(`You: ${message}`,'right');
  socket.emit('send',message);
  messageInput.value='';
})