import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user,socket }) => {

  const[img,setImg]=useState(null)
  useEffect(()=>{
    socket.on("whiteBoardDataResponse",(data)=>{
      setImg(data.imageURL)
    })
  },[])

  const [isDrawing, setIsDrawing] = useState(false);
  
//3d052882-e0c8-cd80-9a8b-5dfb26150b53
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      const ctx = canvas.getContext('2d');
      if (ctx){
      ctxRef.current = ctx;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';}
    }
  }, [color, canvasRef, ctxRef]);

  useEffect(() => {
    if(ctxRef.current){
    ctxRef.current.strokeStyle = color;}
  }, [color, ctxRef]);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      const roughCanvas = rough.canvas(canvasRef.current);
      if (elements.length > 0) {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      elements.forEach((element) => {
        if (element.type === 'pencil') {
          roughCanvas.linearPath(element.path, {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          });
        } else if (element.type === 'line') {
          roughCanvas.draw(
            roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            })
          );
        } else if (element.type === 'rectangle') {
          roughCanvas.draw(
            roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            })
          );
        }
      });
    }
    if (user?.presenter && socket && canvasRef.current) {
      const canvasImg = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImg);
    }
  }, [elements, canvasRef]);

  const handleMouseDown = (e) => {
    if (!user?.presenter) {
      return;
    }

    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === 'pencil') {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: 'pencil',
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === 'line') {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: 'line',
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === 'rectangle') {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: 'rectangle',
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!user?.presenter || !isDrawing) {
      return;
    }

    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === 'pencil') {
      if (elements.length > 0) {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];

        setElements((prevElements) =>
          prevElements.map((ele, index) =>
            index === elements.length - 1 ? { ...ele, path: newPath } : ele
          )
        );
      }
    } else if (tool === 'line') {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1 ? { ...ele, width: offsetX, height: offsetY } : ele
        )
      );
    } else if (tool === 'rectangle') {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? { ...ele, width: offsetX - ele.offsetX, height: offsetY - ele.offsetY }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  if (!user?.presenter) {
    return (
      <div className='border border-dark border-2 h-100 w-100 overflow-hidden bg-white rounded-2'>
        <img src={img} alt='Real time white board'
        style={{
          height:window.innerHeight * 2,
          width:"285%",
        }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className='border border-dark border-2 h-100 w-100 overflow-hidden ms-0 bg-white rounded-2'>
      
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;


