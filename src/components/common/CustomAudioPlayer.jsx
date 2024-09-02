import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import SvgComponent from "../SvgComponent/SvgComponent";

const CustomAudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const waveformBars = [4, 6, 3, 5, 2, 4, 6, 3, 5, 2, 4, 6, 3, 5, 2]; // Each represents a segment of the waveform

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef?.current?.currentTime === audioRef?.current?.duration) {
        audioRef.current.currentTime = 0; // Reset to start if the audio is finished
      }
      audioRef?.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef?.current?.currentTime);
    if (audioRef?.current?.currentTime === audioRef?.current?.duration) {
      setIsPlaying(false); // Reset the play button when the audio ends
    }
  };

  const handleSeek = (index) => {
    const segmentDuration = audioRef?.current?.duration / waveformBars?.length;
    const newTime = segmentDuration * index;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      ?.toString()
      .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  useEffect(() => {
    const handleLoadedMetadata = () => {
      const durationInSeconds = audioRef?.current?.duration;
      setDuration(formatDuration(durationInSeconds));
    };

    if (audioRef?.current) {
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false)); // Reset play button when audio ends
    }

    return () => {
      if (audioRef?.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", () =>
          setIsPlaying(false)
        );
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-[10px] p-3 rounded-xl bg-blue-50 relative w-[265px] ">
      <button onClick={togglePlay}>
        {isPlaying ? (
          <SvgComponent name={"VoicePauseIcon"} />
        ) : (
          <SvgComponent name={"VoicePlayIcon"} />
        )}{" "}
      </button>
      <div className="gap-[10px] flex items-center ">
        <div className="flex items-center space-x-1">
          {waveformBars.map((height, index) => {
            const segmentDuration =
              audioRef?.current?.duration / waveformBars?.length;
            const isActive = currentTime >= segmentDuration * index;
            return (
              <div
                key={index}
                className={`w-[2.4px] h-${height} ${
                  isActive ? "bg-blue-500" : "bg-gray-300"
                } rounded cursor-pointer`}
                onClick={() => handleSeek(index)} // Seek based on bar index
              ></div>
            );
          })}
        </div>
        <span className="text-sm">
          {formatDuration(currentTime)} / {duration}
        </span>
      </div>
      <div className="relative" onClick={toggleMute}>
        {isMuted ? (
          <FaVolumeMute className="text-[#303030] w-[19px] h-[18px] cursor-pointer" />
        ) : (
          <SvgComponent name={"VoiceVoulmeIcon"} />
        )}
      </div>
      <audio ref={audioRef} className="hidden">
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default CustomAudioPlayer;
