//App.tsx
import React, { useEffect, useState } from 'react';
import {Routes,Route} from 'react-router-dom'
import Forms from './Components/Forms'
import RoomPage from './pages/RoomPage/RoomPage';
import {io} from "socket.io-client"
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
const server = "http://localhost:5000";
const connectionOptions= {
  "force new connection":true,
  reconnectionAttempts:Infinity,
  timeout:10000,
  transports:['websocket'],
};

const socket=io(server,connectionOptions)

function App() {
  
  const [user,setUser] = useState(null)
  const [Joinusers,setJoinUsers]=useState([])
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setJoinUsers(data.users)
        //console.log(data.users)
        
      } else {
        console.log("userjoinederror");
      }
      socket.on("allUsers",(data)=>{
        setJoinUsers(data.users)
      });
      socket.on("userJoinedMessageBroadcasted",(data)=>{
        toast.info(`${data} Joined the room`)
      })
    });
    socket.on("userLeftMessageBoardcasted",(data)=>{
      toast.info(`${data} Left the room`)
    })
    // Cleanup function (optional)
    
  }, []);
  

  const userid=()=>{
    var s4 = () =>{
      return (((1+Math.random())*0x10000) | 0).toString(16).substring(1)
    };
    return (
      s4()+
      s4()+
      "-"+
      s4()+
      "-"+
      s4()+
      "-"+
      s4()+
      "-"+
      s4()+
      s4()+
      s4()
    );
  };

  return (
    <div className="container">
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Forms userid={userid()} socket={socket} setUser={setUser}/>}/>
        <Route path='/:roomId' element={<RoomPage user={user} socket={socket} Joinedusers={Joinusers}/>} />
      </Routes>
      
    </div>
  );
}

export default App;
