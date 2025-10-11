import React from "react";
import {
  Briefcase,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const WorkReady = () => {
  const { workReadyResources } = useManageStore();

  const skills = workReadyResources.map((r) => ({
    name: r.title,
    completed: r.status === "completed",
    progress: r.progress || 0,
  }));

  const resources = workReadyResources;

  const completedCount = skills.filter((s) => s.completed).length;
  const totalSkills = skills.length;
  const overallProgress =
    totalSkills > 0 ? ((completedCount / totalSkills) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Work Ready Program</h1>
        <p className="text-gray-400 mt-2">Prepare for your career in tech</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <Briefcase className="w-10 h-10 text-yellow-500" />
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">
              Career Readiness Progress
            </h2>
            <p className="text-gray-400">
              {completedCount} of {totalSkills} modules completed
            </p>
          </div>
          <span className="text-white text-2xl font-bold">
            {overallProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-yellow-500" />
            <span>Career Skills</span>
          </h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {skill.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                    )}
                    <span className="text-white">{skill.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {skill.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      skill.completed ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-yellow-500" />
            <span>Career Resources</span>
          </h3>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{resource.title}</h4>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-semibold">
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {resource.description}
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                  Access Resource
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <h3 className="text-white text-lg font-semibold">
            Career Milestones
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.slice(0, 3).map((milestone, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">
                {milestone.name}
              </h4>
              <p className="text-gray-400 text-sm">
                {milestone.completed ? "Achieved" : "In Progress"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkReady;
