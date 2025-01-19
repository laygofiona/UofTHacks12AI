import React, { useState, useEffect, useRef } from "react";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [key: number]: {
    transcript: string;
  };
}

interface PostData {
  entry: string;
}

interface ApiResponse {
  id: number;
}


interface SpeechRecognitionEvent {
  results: {
    [key: number]: SpeechRecognitionResult;
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface VoiceRecorderProps {
  onRecordingComplete?: (transcript: string) => void;
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

const VoiceRecorder: React.FC = ({
  onRecordingComplete = () => {},
  onRecordingStart = () => {},
  onRecordingStop = () => {},
}: VoiceRecorderProps) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [dailyPrompt, setDailyPrompt] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

  

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      setError("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setError("");
      onRecordingStart();
    };

    recognition.onerror = (event: any) => {
      setError(`Error occurred: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";
      Array.from(event.results).forEach((result) => {
        currentTranscript += result[0].transcript;
      });
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      onRecordingStop();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const addEntryToDatabase = async (transcript: string) => {
    try {
      const res = await fetch('http://0.0.0.0:8000/entry', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"entry": transcript}),
      });

      if (!res.ok) {
        const errorData = await res.json(); // Try to parse error response as JSON
        throw new Error(`${res.status} ${res.statusText}: ${errorData?.message || "Server error"}`);
      }

    } catch (err: any) { // Type the error as any
      setError(err.message);
    } 
    
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onRecordingComplete(transcript);
      // Make a fetch request to post entry to database

      navigate("/main");
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Card className="p-8 bg-amber-50 flex flex-col items-center justify-center w-full max-w-md min-h-[300px]">
      <h2 className="text-xl font-semibold text-red-800 mb-8 text-center">
        {dailyPrompt}
      </h2>

      <div className="relative">
        <Button
          variant="outline"
          size="lg"
          className={`w-20 h-20 rounded-full ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-slate-100 hover:bg-slate-200"
          } transition-colors`}
          onClick={handleToggleRecording}
        >
          {isRecording ? (
            <StopCircle className="h-10 w-10 text-white" />
          ) : (
            <Mic className="h-10 w-10 text-slate-600" />
          )}
        </Button>
      </div>

      <p className="mt-6 text-sm text-red-800">
        {isRecording
          ? "Recording... Click to finish"
          : "Click to start recording"}
      </p>

      <div className="mt-4 text-sm text-slate-800">
        <strong>Transcript:</strong>
        <p>{transcript || "Your transcript will appear here..."}</p>
      </div>

      {error && (
        <div className="text-red-500 mt-4">
          <strong>{error}</strong>
        </div>
      )}
    </Card>
  );
};

export default VoiceRecorder;
