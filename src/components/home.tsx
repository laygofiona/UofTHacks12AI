import React from "react";
import VoiceRecorder from "./VoiceRecorder";

interface HomeProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
}

const Home = ({ onRecordingComplete = () => {} }: HomeProps) => {
  return (
    <div className="flex items-center justify-center p-4 h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
          Daily Voice Journal
        </h1>
        <VoiceRecorder onRecordingComplete={onRecordingComplete} />
      </div>
    </div>
  );
};

export default Home;
