import React, { useState } from "react";
import { Calendar, Clock, Video, User, CheckCircle } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { sessions, addSession } = useManageStore();

  const upcomingSessions = sessions;

  const availableSlots = [
    { date: "2025-10-04", times: ["10:00", "14:00", "16:00"] },
    { date: "2025-10-05", times: ["09:00", "11:00", "15:00"] },
    { date: "2025-10-06", times: ["10:00", "13:00", "16:00"] },
  ];

  const handleBookSession = (sessionData) => {
    addSession({
      id: Date.now(),
      ...sessionData,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Book a Session</h1>
        <p className="text-gray-400 mt-2">
          Schedule mentorship and review sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">
                      {session.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      with {session.instructor}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      session.status === "confirmed"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {session.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {session.time} ({session.duration})
                    </span>
                  </div>
                </div>
                <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Join Session</span>
                </button>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <p className="text-gray-400 text-center">No upcoming sessions.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Book New Session
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Session Type
              </label>
              <select className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500">
                <option>1-on-1 Mentorship</option>
                <option>Code Review</option>
                <option>Career Guidance</option>
                <option>Technical Help</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
              >
                <option value="">Choose a date</option>
                {availableSlots.map((slot) => (
                  <option key={slot.date} value={slot.date}>
                    {slot.date}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots
                    .find((slot) => slot.date === selectedDate)
                    ?.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          selectedTime === time
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-gray-900 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Instructor Preference
              </label>
              <select className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500">
                <option>Emma Wilson</option>
                <option>Lisa Anderson</option>
                <option>Any Available</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Notes (Optional)
              </label>
              <textarea
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 resize-none"
                rows="3"
                placeholder="What would you like to discuss?"
              />
            </div>

            <button
              onClick={() =>
                handleBookSession({
                  title: "New Session",
                  instructor: "Selected Instructor",
                  date: selectedDate,
                  time: selectedTime,
                  duration: "30 min",
                  status: "pending",
                })
              }
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
