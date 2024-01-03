import React, { useState, useRef, useEffect } from 'react';
import './RoomPage.css';
import Chat from '../../Components/Chat';
import WhiteBoard from '../../Components/Whiteboard';
import html2canvas from 'html2canvas';
import { ReactMediaRecorder } from 'react-media-recorder';
const RoomPage = ({ user, socket, Joinedusers }) => {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [opendUsersTab, setOpenUserTab] = useState(true);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [history, setHistroy] = useState([]);
  const [openchattab, setOpenChatTab] = useState(false);
  
  console.log(Joinedusers)
  const handleCnavasClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleundo = () => {
    setHistroy((preHistory) => [...preHistory, elements[elements.length - 1]]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const handleredo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistroy((prevHistory) =>
      prevHistory.slice(0, prevHistory.length - 1)
    );
  };

  const handleSaveAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      html2canvas(canvas).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'whiteboard_image.png';
        link.click();
      });
    }
  };

  useEffect(() => {
    if (user?.presenter) {
      setShowControls(true);
    } else {
      setShowControls(false);
    }
  }, [user, Joinedusers]);

  const handleOpen = (e) => {
    setOpenUserTab(false);
  };

  const setOpen = (e) => {
    setOpenUserTab(true);
  };

  const setchatOpen = (e) => {
    setOpenChatTab(true);
  };

  return (
    <div className="row">
      <button
        type="button"
        className="btn btn-dark"
        style={{
          display: "block",
          position: "absolute",
          top: "5%",
          left: "3%",
          height: "40px",
          width: "100px",
        }}
        onClick={handleOpen}
      >
        Users
      </button>
      <button
        type="button"
        className="btn btn-primary"
        style={{
          display: "block",
          position: "absolute",
          top: "5%",
          left: "10%",
          height: "40px",
          width: "100px",
        }}
        onClick={setchatOpen}
      >
        Chat
      </button>
      {!opendUsersTab && (
        <div
          className="position-fixed top-0  h-100 text-white bg-dark"
          style={{
            width: "200px",
            left: "0%",
          }}
        >
          <button
            type="button"
            className="btn btn-light btn-block w-100 mt-5"
            onClick={setOpen}
          >
            Close
          </button>
          <div className="text-light">
            {Array.isArray(Joinedusers) ? (
              Joinedusers.map((user) => (
              <div key={user.socketId}>{user.name}</div>
            ))
            ) : (
            <div>No users available</div>
            )}
          </div>
            </div>
            )}
      {openchattab && <Chat setOpenChatTab={setOpenChatTab} socket={socket} />}
      <h1 className="text-center py-4 text-white">
        WhiteBoard 
      </h1>
      {/* <span className="text-primary">[Users Online : {Joinedusers.length || 0}]</span> */}
      {showControls && (
        <div className="col-md-10 mx-auto gap-3 px-5  mb-3 d-flex align-items-center justify-content-center">
          <div className="d-flex col-md-2 justify-content-center gap-1">
            <div className="d-flex gap-1 align-itmes-center">
              <label htmlFor="pencil" className='text-white'>Pencil</label>
              <input
                type="radio"
                name="tool"
                value="pencil"
                id="pencil"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="d-flex gap-1 align-itmes-center">
              <label htmlFor="line" className='text-white'>Line</label>
              <input
                type="radio"
                name="tool"
                value="line"
                id="line"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="d-flex gap-1 align-itmes-center">
              <label htmlFor="rectangle" className='text-white'>Rectangle</label>
              <input
                type="radio"
                name="tool"
                value="rectangle"
                id="rectangle"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 mx-auto">
            <div className="d-flex  align-items-center justify-content-center">
              <label htmlFor="color" className='text-white'>Select Color : </label>
              <input
                type="color"
                id="color"
                className="mt-1 ms-3"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-outline-primary mt-1 text-white " disabled={elements.length === 0} onClick={handleundo}>
              Undo
            </button>
            <button className="btn btn-outline-primary mt-1 text-white" disabled={history.length < 1} onClick={handleredo}>
              Redo
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-danger text-white" onClick={handleCnavasClear}>
              Clear Canvas
            </button>
          </div>
        </div>
      )}
      <div className="col-md-8 mx-auto mt-4 canvas-container d-flex flex-column align-items-center">
       
        <WhiteBoard canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} tool={tool} color={color} user={user} socket={socket} />
        <div className='d-flex flex-row gap-5'
        style={{
          
        }}
        >
       
            <button className="btn btn-outline-success mt-2 mb-2 p-0" onClick={handleSaveAsImage}
            style={{width:"100%"}}
            >
              Save as Image
            </button>
            {user?.presenter && (
              <>
                <ReactMediaRecorder
                  screen
                  render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <>
                      <div className='d-flex gap-5 align-items-center'>
                        <div className="d-flex align-items-center">
                          <p className='text-capitalize btn btn-outline-primary'>{status}</p>
                        </div>
                        <div className="d-flex gap-2 w-100">
                          <button onClick={startRecording} className='btn btn-outline-success p-1 mt-2 mb-2' style={{ height: "70%" }}>
                            Start Recording
                          </button>
                          <button onClick={stopRecording} className='btn btn-outline-danger p-1 mt-2 mb-2' style={{ height: "70%", width:"70%" }}>
                            Stop Recording
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 position-absolute top-50 end-0 translate-middle-y" >
                        <video src={mediaBlobUrl} controls autoPlay loop style={{ width: "100%", height: "130%" }} />
                      </div>

                    </>
                  )}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
