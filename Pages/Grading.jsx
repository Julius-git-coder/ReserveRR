import React from "react";
import { Award } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const Grading = () => {
  const { grades } = useManageStore();

  const totalEarned = grades.reduce((sum, grade) => sum + grade.earned, 0);
  const totalPossible = grades.reduce((sum, grade) => sum + grade.total, 0);
  const overallPercentage =
    totalPossible > 0 ? ((totalEarned / totalPossible) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Grading Overview</h1>
        <p className="text-gray-400 mt-2">
          Detailed breakdown of your academic performance
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <Award className="w-10 h-10 text-yellow-500" />
          <div>
            <h2 className="text-white text-2xl font-bold">
              Overall Grade: {totalEarned}/{totalPossible}
            </h2>
            <p className="text-gray-400">
              {overallPercentage}% of total points earned
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {grades.map((grade, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">
                {grade.category}
              </h3>
              <span className="text-gray-300 font-semibold">
                {grade.earned}/{grade.total} pts
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${grade.percentage}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">
              {grade.percentage}% complete
            </p>
          </div>
        ))}
        {grades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No grades available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grading;
