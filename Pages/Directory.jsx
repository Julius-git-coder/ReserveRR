import React, { useState } from "react";
import { Search, User, Mail, Github, MessageSquare } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { directory } = useManageStore();

  const filteredPeople = directory.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Directory</h1>
        <p className="text-gray-400 mt-2">
          Connect with classmates and instructors
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPeople.map((person, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold text-lg">
                    {person.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      person.role === "Instructor"
                        ? "bg-yellow-500 text-gray-900"
                        : person.role === "Teaching Assistant"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {person.role}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {person.cohort || person.specialty}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{person.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>{person.github}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No results found.</p>
        </div>
      )}
    </div>
  );
};

export default Directory;
