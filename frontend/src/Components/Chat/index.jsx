import React, { useState, useEffect } from 'react';

const Chat = ({ setOpenChatTab, socket }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('messageBoardcase', (data) => {
      setChat((prevChats)=>[...prevChats, data]);
    });
  }, [socket]);

  const handlesend = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('message', {message});
      setChat((prevChats)=>[...prevChats,{message,name:"You"}])
      
      setMessage(''); // Clear the input field after sending the message
    }
  };

  return (
    <div
      className='position-fixed top-0 h-100 text-white bg-dark'
      style={{ width: '400px', left: '0%' }}
    >
      <button
        type='button'
        onClick={() => setOpenChatTab(false)}
        className='btn btn-light btn-block w-100 mt-5'
      >
        Close
      </button>
      <div
        className='w-100 mt-5 p-2 border border-1 border-white rounded-3'
        style={{ height: '70%', overflowY: 'auto' }}
      >
        {chat.map((message, index) => (
          <div key={index} className='mb-2 text-white'>
            {message.name}:{message.message}
          </div>
        ))}
      </div>
      <form className='w-100 mt-4 d-flex rounded-3' onSubmit={handlesend}>
        <input
          type='text'
          placeholder='Enter Message'
          className='h-100 border-0 rounded-0 py-2 px-2 borrder-0 outline-none'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '90%' }}
        />
        <button type='submit' className='btn btn-primary rounded-0'>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
