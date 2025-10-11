import React from "react";
import { FolderOpen } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const Projects = () => {
  const { projects, addProject } = useManageStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-2">
            Your weekly and monthly project submissions
          </p>
        </div>
        <button
          onClick={() => {
            // For demonstration
            addProject({
              id: Date.now(),
              title: "New Project",
              week: 1,
              status: "in-progress",
              technologies: [],
            });
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Submit New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  {project.title}
                </h3>
                <span className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                  Week {project.week}
                </span>
              </div>
              <FolderOpen className="w-6 h-6 text-yellow-500" />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-900 text-gray-300 px-2 py-1 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.status === "completed" ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Grade</span>
                  <span className="text-white font-semibold">
                    {project.grade}/{project.maxGrade}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${(project.grade / project.maxGrade) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {project.status.toUpperCase()}
            </span>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No projects available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
