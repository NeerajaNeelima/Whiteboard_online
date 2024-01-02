import React from 'react';
import './index.css';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';

const Forms = ({ userid, socket, setUser }) => {
  return (
    <div className='row h-100 pt-5'>
      <div className="col-md-4 mt-5 border  rounded-2 mx-auto d-flex flex-column align-items-center form-container   p-5 border-primary">
        <h1 className='text-primary fw-bold'>Create Room</h1>
        <CreateRoomForm userid={userid} socket={socket} setUser={setUser} />
      </div>
      <div className="col-md-4 mt-5 border  rounded-2 mx-auto d-flex flex-column align-items-center form-container  p-5 border-primary">
        <h1 className='text-primary fw-bold'>Join Room</h1>
        <JoinRoomForm socket={socket} setUser={setUser} />
      </div>
    </div>
  );
};

export default Forms;
