const socketio = require('socket.io-client');
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


//Get Username and room from URL
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})


const socket = io();

//Join Chatroom
socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room); //ye sirf ek room value hai
    outputUsers(users); //ye users array hai
})

//Catch emit message from server
socket.on('message',message=>{
    console.log(message)
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//When click on send (submit form)
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //Get msg text
    const msg = e.target.elements.msg.value; //msg is id of input tag

    //Emit message to server -> bi-directional data send
    socket.emit('chatMessage',msg);

    //Clear input box and make focus on it
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus();

})

//Output message to DOM

function outputMessage(message){ //ye krne se new chat msg show hoga
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//add room name to DOM
function outputRoomName(room){
    roomName.innerHTML = room;
}

//add users to DOM

function outputUsers(users){
     userList.innerHTML = `${users.map(user=>`<li>${user.username}</li>`).join('')}`
}
