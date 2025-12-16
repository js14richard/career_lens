import { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import AppliedJobsTab from "./tabs/AppliedJobsTab";

type Tab = "profile" | "applications";

function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Candidate Dashboard</h1>

      {/* Tabs */}
      <div className="border-b mb-6 flex gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-2 ${
            activeTab === "applications"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Applied Jobs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "applications" && <AppliedJobsTab />}
    </div>
  );
}

export default CandidateDashboard;
