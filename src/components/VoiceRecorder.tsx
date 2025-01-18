import React, { useState, useEffect } from "react";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  isRecording?: boolean;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

const dailyPrompts = [
  "What's on your mind today?",
  "What's the best thing that happened to you today?",
  "What choices have defined you today?",
  "What are the worst choices you've made today?",
  "How are you feeling right now?",
  "What's challenging you today?",
  "What are you grateful for today?",
  "What's something new you learned today?",
];

const VoiceRecorder = ({
  onRecordingComplete = () => {},
  isRecording: externalIsRecording,
  onRecordingStart = () => {},
  onRecordingStop = () => {},
}: VoiceRecorderProps) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [dailyPrompt, setDailyPrompt] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
    setDailyPrompt(dailyPrompts[randomIndex]);
  }, []);

  // Simulate audio level changes when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random());
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onRecordingStop();
      onRecordingComplete(new Blob());
      console.log("Clicked");
      navigate("/main"); // Navigate to main page after recording stops
    } else {
      setIsRecording(true);
      onRecordingStart();
    }
  };

  return (
    <Card className="p-8 bg-white flex flex-col items-center justify-center w-full max-w-md min-h-[300px]">
      <h2 className="text-xl font-semibold text-slate-800 mb-8 text-center">
        {dailyPrompt}
      </h2>

      <AnimatePresence>
        <div className="relative">
          <Button
            variant="outline"
            size="lg"
            className={`w-20 h-20 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-slate-100 hover:bg-slate-200"} transition-colors`}
            onClick={handleToggleRecording}
          >
            {isRecording ? (
              <StopCircle className="h-10 w-10 text-white" />
            ) : (
              <Mic className="h-10 w-10 text-slate-600" />
            )}
          </Button>
        </div>
      </AnimatePresence>

      <p className="mt-6 text-sm text-slate-600">
        {isRecording
          ? "Recording... Click to finish"
          : "Click to start recording"}
      </p>
    </Card>
  );
};

export default VoiceRecorder;
