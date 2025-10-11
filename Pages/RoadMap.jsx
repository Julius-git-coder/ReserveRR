import React from "react";
import { Map, CheckCircle, Circle, Clock } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const RoadMap = () => {
  const { roadmapItems } = useManageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-gray-400 mt-2">
          Your structured path to becoming a full-stack developer
        </p>
      </div>

      <div className="space-y-6">
        {roadmapItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Map className="w-6 h-6 text-yellow-500" />
                <h3 className="text-white text-xl font-semibold">
                  {item.phase}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === "completed"
                    ? "bg-green-500 text-white"
                    : item.status === "in-progress"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              {item.weeks.map((week, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {week.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : item.status === "in-progress" &&
                      idx === item.weeks.findIndex((w) => !w.completed) ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <p className="text-white font-medium">Week {week.week}</p>
                      <p className="text-gray-400 text-sm">{week.topic}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {roadmapItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No roadmap items available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadMap;
