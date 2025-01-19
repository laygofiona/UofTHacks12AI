import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Emotion = "happy" | "sad" | "neutral" | "angry" | "excited";

interface EmotionEntry {
  date: Date;
  emotion: Emotion;
}

interface EmotionCalendarProps {
  entries?: EmotionEntry[];
  onDateSelect?: (date: Date) => void;
}

const emotionColors: Record<Emotion, string> = {
  happy: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800",
  angry: "bg-red-100 text-red-800",
  excited: "bg-green-100 text-green-800",
};

const defaultEntries: EmotionEntry[] = [
  { date: new Date(2024, 2, 1), emotion: "happy" },
  { date: new Date(2024, 2, 5), emotion: "sad" },
  { date: new Date(2024, 2, 10), emotion: "excited" },
  { date: new Date(2024, 2, 15), emotion: "angry" },
  { date: new Date(2024, 2, 20), emotion: "neutral" },
];

const EmotionCalendar = ({
  entries = defaultEntries,
  onDateSelect = () => {},
}: EmotionCalendarProps) => {
  const emotionsByDate = entries.reduce((acc, entry) => {
    acc[entry.date.toDateString()] = entry.emotion;
    return acc;
  }, {} as Record<string, Emotion>);

  return (
    <Card className="p-4 flex flex-col items-center">
      <TooltipProvider>
        <Calendar
          style={{ fontSize: "1.2rem" }}
          mode="single"
          onSelect={onDateSelect}
          className="rounded-md border flex flex-row justify-center"
          modifiers={{
            emotion: (date) => date.toDateString() in emotionsByDate,
          }}
          classNames={{
            head_cell: "w-16 font-normal text-muted-foreground text-xl",
          }}
          modifiersClassNames={{
            emotion: "font-bold",
          }}
          components={{
            Day: ({ date, className, ...props }: any) => {
              const emotion = emotionsByDate[date.toDateString()];
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      {...props}
                      className={cn(
                        props.className,
                        "w-16 h-16 rounded-full transition-colors flex items-center justify-center font-medium",
                        emotion ? emotionColors[emotion] : ""
                      )}
                    >
                      {date.getDate()}
                    </button>
                  </TooltipTrigger>
                  {emotion && (
                    <TooltipContent>
                      <p className="capitalize">{emotion}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            },
          }}
        />
      </TooltipProvider>
      <div className="mt-4 flex justify-center gap-4">
        {Object.entries(emotionColors).map(([emotion, color]) => (
          <div key={emotion} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${color.split(" ")[0]}`} />
            <span className="text-sm capitalize">{emotion}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionCalendar;
