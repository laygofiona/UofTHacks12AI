import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BarChart, PieChart, LineChart, Activity } from "lucide-react";

interface InsightData {
  period: string;
  emotionalPatterns: {
    emotion: string;
    percentage: number;
    count: number;
  }[];
  keyThemes: {
    theme: string;
    frequency: number;
  }[];
}

interface InsightsPanelProps {
  data?: InsightData;
  onPeriodChange?: (period: string) => void;
}

const defaultData: InsightData = {
  period: "week",
  emotionalPatterns: [
    { emotion: "Happy", percentage: 40, count: 8 },
    { emotion: "Neutral", percentage: 30, count: 6 },
    { emotion: "Sad", percentage: 20, count: 4 },
    { emotion: "Angry", percentage: 10, count: 2 },
  ],
  keyThemes: [
    { theme: "Work", frequency: 12 },
    { theme: "Family", frequency: 8 },
    { theme: "Health", frequency: 6 },
    { theme: "Hobbies", frequency: 4 },
  ],
};

const InsightsPanel = ({
  data = defaultData,
  onPeriodChange = () => {},
}: InsightsPanelProps) => {
  return (
    <Card className="w-full h-fit max-w-[400px] p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">AI Insights</h2>
        <Select defaultValue={data.period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Emotional Patterns</h3>
            </div>
            <div className="space-y-3">
              {data.emotionalPatterns.map((pattern) => (
                <div key={pattern.emotion} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{pattern.emotion}</span>
                    <span>{pattern.count} entries</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Key Themes</h3>
            </div>
            <div className="space-y-4">
              {data.keyThemes.map((theme) => (
                <div
                  key={theme.theme}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{theme.theme}</span>
                  <span className="text-sm text-gray-500">
                    {theme.frequency} mentions
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default InsightsPanel;
