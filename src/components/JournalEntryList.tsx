import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import EmotionCalendar from "./EmotionCalendar";
import { CalendarIcon, Clock, MessageCircle } from "lucide-react";
import { useEffect } from "react";

interface JournalEntry {
  id: string;
  timestamp: Date;
  entry: string;
  ai_summary: string;
  quick_takeaway: string;
  alternative_scenarios: string;
  overall_emotion: "happy" | "sad" | "neutral" | "angry" | "excited";
  word_count: number;
  date: string;
}

interface JournalEntryListProps {
  entries?: JournalEntry[];
  onEntrySelect?: (entry: JournalEntry) => void;
}


const emotionColors = {
  happy: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800",
  angry: "bg-red-100 text-red-800",
  excited: "bg-green-100 text-green-800",
};

const JournalEntryList = ({
  entries,
  onEntrySelect = () => {},
}: JournalEntryListProps) => {
  const navigate = useNavigate();

  const handleEntryClick = (entry: JournalEntry) => {
    onEntrySelect(entry);
    navigate(`/entry/${entry.id}`, { state: {id: entry.id}});
  };

  // Map entries to EmotionEntry format for EmotionCalendar
  const emotionEntries = entries.map((entry) => ({
    date: entry.timestamp,
    emotion: entry.overall_emotion,
  }));
  
  return (
    <Card className="w-full max-w-[800px] bg-green-50 p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[700px]">
            <EmotionCalendar emotion_entries={emotionEntries} />
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleEntryClick(entry)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>
                        {entry.timestamp.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{entry.entry}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      emotionColors[entry.overall_emotion]
                    }`}
                  >
                    {entry.overall_emotion}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  <MessageCircle size={16} />
                  <span>{entry.word_count} words</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default JournalEntryList;
