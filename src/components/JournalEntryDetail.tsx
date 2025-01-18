import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface JournalEntry {
  id: string;
  timestamp: Date;
  text: string;
  emotion: "happy" | "sad" | "neutral" | "angry" | "excited";
}

interface AIInsights {
  summary: string;
  quickTakeaway: string;
  alternativeScenarios: {
    choice: string;
    outcome: string;
  }[];
}

const defaultEntry: JournalEntry = {
  id: "1",
  timestamp: new Date(),
  text: "Had a great meeting today with the team. Everyone was very enthusiastic about the new project. We discussed various approaches and settled on a promising direction. The energy in the room was fantastic, and I feel confident about our next steps.",
  emotion: "happy",
};

const defaultInsights: AIInsights = {
  summary:
    "The journal entry reflects a positive and productive team meeting that boosted morale and established clear project direction.",
  quickTakeaway:
    "Collaborative discussion led to team alignment and increased confidence in project success.",
  alternativeScenarios: [
    {
      choice: "Could have pushed for my original idea more strongly",
      outcome:
        "Might have created tension and reduced team buy-in, potentially affecting project momentum",
    },
    {
      choice: "Could have scheduled individual follow-ups",
      outcome:
        "Might have gained deeper insights and strengthened personal connections with team members",
    },
  ],
};

const JournalEntryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // In a real app, fetch the entry and insights based on the ID
  const entry = defaultEntry;
  const insights = defaultInsights;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Journal
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {entry.timestamp.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  {entry.timestamp.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{entry.text}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-medium text-gray-500">Summary</h3>
              <p className="mt-2">{insights.summary}</p>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-medium text-gray-500">
                Quick Takeaway
              </h3>
              <p className="mt-2 text-sm">{insights.quickTakeaway}</p>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-medium text-gray-500">
                Alternative Scenarios
              </h3>
              <div className="mt-2 space-y-4">
                {insights.alternativeScenarios.map((scenario, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium">{scenario.choice}</p>
                    <p className="text-sm text-gray-600">{scenario.outcome}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JournalEntryDetail;
