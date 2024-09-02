import React, { useState, useRef, useEffect } from "react";
import SvgComponent from "../SvgComponent/SvgComponent";

const VideoPreviewModal = ({ videoSrc, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleCanPlay = () => {
    const video = videoRef.current;
    const duration = video.duration;
    if (isNaN(duration) || !isFinite(duration)) {
      console.error("Invalid video duration:", duration);
    } else {
      setDuration(duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video?.src) {
      video.src = videoSrc; // Set the src via ref

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
      };
    } else {
      return () => {
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
      };
    }
  }, [videoSrc]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const progressBar = e.target;
    const clickPosition = e.nativeEvent.offsetX / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-[70%] h-[80%] bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl cursor-pointer z-[9]"
        >
          <SvgComponent name={"ImagePreviewCrossIcon"} />
        </button>

        <div className="relative w-full h-[91%]">
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onCanPlay={handleCanPlay}
            onTimeUpdate={handleTimeUpdate}
            src={videoSrc}
          />

          {/* Large play button overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black text-white z-[5] "
            >
              {/* <span className="w-16 h-16 opacity-75"> */}
              <SvgComponent name={"LargePlayVideoIcon"} />
              {/* </span> */}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-900">
          <button onClick={togglePlayPause} className="">
            {isPlaying ? (
              <SvgComponent name={"VoicePauseIcon"} />
            ) : (
              <SvgComponent name={"VoicePlayIcon"} />
            )}
          </button>
          <div
            className="flex-1 mx-4 h-1 bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
