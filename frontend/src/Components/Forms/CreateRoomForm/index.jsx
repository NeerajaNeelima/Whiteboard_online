import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CreateRoomForm = ({ userid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(userid);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userid: userid,
      host: true,
      presenter: true,
    };
    setUser(roomData);
    navigate(`${roomId}`);
    socket.emit('userJoined', roomData);
  };

  const handleGenerate = () => {
    setRoomId(userid);
  };

  return (
    <form className='form col-md-12 mt-5' onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='text'
          className='form-control my-2'
          placeholder='Enter Your Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='form-group border rounded-2 '>
        <div className='input-group d-flex align-items-center justify-content-center'>
          <input
            type='text'
            id='roomIdInput'
            value={roomId}
            className='form-control my-2 border-0 mx-1'
            disabled
            placeholder='Generate Room Code'
          />
          <div className='input-group-append '>
            <button
              className='btn btn-primary btn-sm me-1'
              type='button'
              onClick={handleGenerate}
            >
              Generate
            </button>
            <CopyToClipboard
              text={roomId}
              onCopy={() => toast.success('Room Id Copied To Clipboard!')}
            >
              <button
                className='btn btn-outline-dark border-0 btn-sm'
                type='button'
              >
                Copy
              </button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      <button
        type='submit'
        className='mt-4 btn btn-primary btn-block form-control'
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
