const users =[];
const addUsers =({name,userId,roomId,host,presenter,socketId})=>{
    const user={name,userId,roomId,host,presenter,socketId};
    users.push(user);
    return user;
}

const removeUser=(id)=>{
    const index=users.findIndex(user=>user.socketId===id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser=(id)=>{
    return users.find((user)=>user.socketId===id);
}

const getUsersInRoom=(roomId)=>{
    return users.filter((user)=>user.roomId===roomId)
}

module.exports={
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom,
};