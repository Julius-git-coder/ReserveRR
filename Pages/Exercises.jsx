import React from "react";
import { Dumbbell, CheckCircle } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const Exercises = () => {
  const { exercises } = useManageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Exercises</h1>
        <p className="text-gray-400 mt-2">
          Practice exercises to reinforce your learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Dumbbell className="w-6 h-6 text-yellow-500" />
                <h3 className="text-white font-semibold">{exercise.title}</h3>
              </div>
              {exercise.completed && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                {exercise.points} points
              </span>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  exercise.completed
                    ? "bg-gray-700 text-gray-400"
                    : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                }`}
              >
                {exercise.completed ? "Completed" : "Start Exercise"}
              </button>
            </div>
          </div>
        ))}
        {exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No exercises available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
