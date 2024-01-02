import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
interface CreateRoomFormProps {
  
  socket:any;
  setUser:(user:any)=>void;
}

const JoinRoomForm: React.FC<CreateRoomFormProps> = ({socket ,setUser}) =>{
 
  const [roomId,setRoomId] = useState("");
  const [name,setName] = useState("");
  const navigate=useNavigate();
  const handleJoinRoom=(e:React.FormEvent<HTMLFormElement>)=>{
     e.preventDefault();
     const roomData ={
      name,
      roomId,
      host:true,
      presenter:false
    };
    setUser(roomData);
    navigate(`${roomId}`)
    socket.emit("userJoined",roomData)
  }
  return (
    <form className='form col-md-12 mt-5' onSubmit={handleJoinRoom}>
    <div className='form-group'>
      <input type="text" className='form-control my-2'
      placeholder='Enter Your Name'
      onChange={(e)=>setName(e.target.value)}
      />
    </div>
    <div className='form-group  '>
      <input
        type="text"
        className='form-control my-2 '
        placeholder='Enter Room Code'
        onChange={(e)=>setRoomId(e.target.value)}
        />
    </div>
    <button type="submit" className='mt-4 btn btn-primary btn-block form-control'
    
    >
      Join Room 
    </button>
  </form>
  )
}

export default JoinRoomForm