import React from "react";
import JournalEntryList from "./JournalEntryList";
import InsightsPanel from "./InsightsPanel";
import { useEffect, useState } from "react";

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

const MainPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getEntriesList = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);

    try {
      const res = await fetch('http://0.0.0.0:8000/entries');

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: JournalEntry[] = await res.json();
      setEntries(data);
    } catch (err: any) {
      console.error("Error fetching entries:", err); // Use console.error for errors
      setError("Failed to fetch entries. Please try again later."); // User-friendly error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEntriesList();
  }, []);

  if (loading) {
    return <div className="text-center pt-[20rem] text-2xl">Loading journal entries...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-amber-900">Your Journal</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <JournalEntryList entries={entries} />
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default MainPage;