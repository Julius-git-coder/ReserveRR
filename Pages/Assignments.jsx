import React, { useState } from "react";
import { Calendar, Award, Upload, X } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const Assignments = ({ studentId }) => {
  const [filter, setFilter] = useState("all");
  const [showSubmissionModal, setShowSubmissionModal] = useState(null);
  const [submissionType, setSubmissionType] = useState("url");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [error, setError] = useState("");
  const { assignments, updateAssignment } = useManageStore();

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const filteredAssignments = studentId
    ? filter === "all"
      ? assignments.filter((a) => a.studentId === parseInt(studentId))
      : assignments.filter(
          (a) => a.studentId === parseInt(studentId) && a.status === filter
        )
    : assignments; // If no studentId, show all assignments (e.g., for admin view)

  const handleSubmission = (assignmentId) => {
    if (submissionType === "url" && !isValidUrl(submissionUrl)) {
      setError("Please enter a valid URL.");
      return;
    }
    if (submissionType === "image" && !submissionFile) {
      setError("Please select an image file.");
      return;
    }

    if (submissionType === "image" && submissionFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateAssignment(assignmentId, {
          status: "submitted",
          submission: e.target.result,
          submissionType: "image",
        });
        setShowSubmissionModal(null);
        setSubmissionUrl("");
        setSubmissionFile(null);
        setError("");
      };
      reader.readAsDataURL(submissionFile);
    } else {
      updateAssignment(assignmentId, {
        status: "submitted",
        submission: submissionUrl,
        submissionType: "url",
      });
      setShowSubmissionModal(null);
      setSubmissionUrl("");
      setSubmissionFile(null);
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSubmissionFile(file);
      setError("");
    } else {
      setError("Please select a valid image file.");
      setSubmissionFile(null);
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">Assignments</h1>
          <p className="text-gray-400 mt-2">
            Track and submit your assignments
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "all"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter all assignments"
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "pending"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter pending assignments"
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("submitted")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "submitted"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter submitted assignments"
        >
          Submitted
        </button>
        <button
          onClick={() => setFilter("graded")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "graded"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter graded assignments"
        >
          Graded
        </button>
      </div>

      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">
                Submit Assignment
              </h2>
              <button
                onClick={() => {
                  setShowSubmissionModal(null);
                  setSubmissionUrl("");
                  setSubmissionFile(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
                aria-label="Close submission modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSubmissionType("url");
                    setSubmissionFile(null);
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    submissionType === "url"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  URL
                </button>
                <button
                  onClick={() => {
                    setSubmissionType("image");
                    setSubmissionUrl("");
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    submissionType === "image"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  Image
                </button>
              </div>
              {submissionType === "url" ? (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Submission URL
                  </label>
                  <input
                    type="text"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    placeholder="Enter submission URL"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSubmissionModal(null);
                    setSubmissionUrl("");
                    setSubmissionFile(null);
                    setError("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmission(showSubmissionModal)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No assignments found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {assignment.title}
                  </h3>
                  {assignment.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm flex-wrap">
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {assignment.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{assignment.points} points</span>
                    </span>
                  </div>
                  {assignment.submission && (
                    <div className="mt-3">
                      {assignment.submissionType === "image" ? (
                        <div>
                          <p className="text-gray-400 text-sm mb-2">
                            Submitted Image:
                          </p>
                          <img
                            src={assignment.submission}
                            alt="Your submission"
                            className="w-full max-w-md h-48 object-contain rounded-lg border border-gray-700"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-400 text-sm mb-2">
                            Submitted URL:
                          </p>
                          <a
                            href={assignment.submission}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:text-yellow-400 underline break-all"
                          >
                            {assignment.submission}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {assignment.status === "graded" && (
                    <div className="mt-3">
                      <p className="text-gray-300 text-sm font-semibold">
                        Grade: {assignment.grade}/{assignment.points}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assignment.status === "graded"
                        ? "bg-green-500 text-white"
                        : assignment.status === "submitted"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {assignment.status.toUpperCase()}
                  </span>
                  {assignment.status === "pending" && (
                    <button
                      onClick={() => setShowSubmissionModal(assignment.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                      aria-label={`Submit assignment ${assignment.title}`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;
