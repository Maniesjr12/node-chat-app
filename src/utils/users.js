
const users = [];

const addUser = ({id, username, room})=>{

    // trim data 
     username = username.trim().toLowerCase()
     room= room.trim().toLowerCase()
     
    if(!username || !room){
        return{
            error:'user name and room required'
        }
    }
    // check for existing user
    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {
            error:' user already exist in room'
        }
    }
    const user = {id, username,room}
     users.push(user)
     return {user}
}


const removeUser = (id)=>{
   const userIndex = users.findIndex((user)=>{
       return  user.id === id
    })
    if(userIndex !== -1){

        return users.splice(userIndex, 1)[0]
    } 


}

const getUser = (id)=>{
   let found = users.find((user)=> user.id === id)
  return found
}

const getUsersInRoom = (room)=>{
    const usersInRoom = users.filter((user)=> user.room === room)
    return usersInRoom
}
 
 

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser

}
