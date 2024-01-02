const express=require("express");
const app=express();

const server=require('http').createServer(app);
const {Server}=require("socket.io");
const { addUsers, removeUser,getUser } = require("./utill/user");

const io=new Server(server);


const cors = require('cors');
app.use(cors());


app.get("/",(req,res)=>{
    res.send("Whiteboard sharing app")
});

let GlobalroomId,imageURLGloabl
io.on("connection",(socket)=>{
    socket.on("userJoined",(data)=>{
        const {name,userId,roomId,host,presenter}=data;
        GlobalroomId=roomId
        socket.join(roomId);
        const users=addUsers({name,userId,roomId,host,presenter,socketId:socket.id});
        socket.emit("userIsJoined",{
            success:true,
            users
        })
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name)
        socket.broadcast.to(roomId).emit("allUsers",users)
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
            imageURL:imageURLGloabl,
        })
    })
    socket.on("whiteboardData",(data)=>{
    imageURLGlobal=data;
    socket.broadcast.to(GlobalroomId).emit("whiteBoardDataResponse",{
        imageURL:data,
    })
})
    socket.on("message",(data)=>{
        const {message}=data;
        const user=getUser(socket.id)
        console.log(user)
        if(user){
            socket.broadcast.to(GlobalroomId).emit("messageBoardcase",{message,name:user.name});
        }
        
    })
    

    socket.on("disconnect",()=>{
        const user=getUser(socket.id)
        console.log(user)
        if(user){
            const remove=removeUser(socket.id)
            console.log(socket.id)
            socket.broadcast.to(GlobalroomId).emit("userLeftMessageBoardcasted",user.name)  
        }
      
    })
});


const PORT= process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log('Server connecting to the http://localhost:5000')
});

