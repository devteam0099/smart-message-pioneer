import React, { useState, useEffect, useRef } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const ImagePreviewModal = ({ imageSrc, isOpen, onClose }) => {
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <div className="flex justify-between items-start absolute top-0 w-full p-4 z-50">
        <button
          onClick={() => {
            onClose();
            setIsFullScreen(false);
          }}
        >
          <SvgComponent name={"ImagePreviewCrossIcon"} />
        </button>
        <div className="flex space-x-2">
          <button onClick={() => zoomIn()}>
            <SvgComponent name={"ImageZoomIcon"} />
          </button>
          <button onClick={() => zoomOut()}>
            <SvgComponent name={"ImageZoomOutIcon"} />
          </button>
          <button onClick={handleToggleFullScreen}>
            <SvgComponent name={"ImageFullScreenIcon"} />
          </button>
        </div>
      </div>
    );
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleToggleFullScreen = () => setIsFullScreen(!isFullScreen);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ${
        isFullScreen ? "p- m-0 w-full h-full" : "p-[20px]"
      }`}
    >
      <div
        className={`relative flex items-center justify-center overflow-auto ${
          isFullScreen ? "w-full h-full" : "w-[900px] h-[600px] rounded-[25px]"
        } bg-[#4d5364ab] z-50`}
      >
        <TransformWrapper>
          <Controls />
          <TransformComponent>
            <img
              src={imageSrc}
              alt="Preview"
              className={`max-w-full transform object-contain z-20 select-none 
          `}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
