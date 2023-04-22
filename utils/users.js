const users = [];

//Join user to chat
function userJoin(id,username,room){
    const user = {id,username,room}

    users.push(user);

    return user;

}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
} 

//USer Leaves chat
function userLeave(id){
    const index = users.findIndex(user=>user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0] //to remove 1 element at index
    }
}

//Get room users for showing in left side
function getRoomUser(room){
    return users.filter(user => user.room === room)

}

//we do export to bring it in server.js
module.exports ={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUser
}