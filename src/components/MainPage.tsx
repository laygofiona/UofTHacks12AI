import React from "react";
import JournalEntryList from "./JournalEntryList";
import InsightsPanel from "./InsightsPanel";

const MainPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Your Journal</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <JournalEntryList />
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
