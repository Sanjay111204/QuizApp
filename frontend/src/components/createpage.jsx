import React, { useState, useEffect } from "react";
import SP from "./startpage";
import { useLocation } from "react-router";

const Createpage = () => {
  const [check, setCheck] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const loc = useLocation();

  useEffect(() => {
    const { a, b } = loc.state || {};
    setRoomCode(b || "");
    setName(a || "");
  }, [loc]);

  const handleJoin = () => {
    if (!topic) {
      alert("Please enter a quiz topic.");
      return;
    }
    setCheck(true);
  };

  if (!check) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 min-h-screen flex justify-center items-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 transform transition-all hover:scale-[1.03] duration-300">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-2 font-logo drop-shadow-md">
              QuizRush
            </h1>
            <p className="text-gray-600">Real-time quiz with friends!</p>
          </div>

          {/* Topic Input */}
          <input
            type="text"
            placeholder="Enter Quiz Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-sm text-center"
          />

          {/* User Info */}
          <div className="text-center font-semibold text-gray-700 text-xl">
            <p>
              Name: <span className="text-indigo-600">{name}</span>
            </p>
          </div>

          <div className="text-center font-semibold text-gray-900 text-xl">
            <p>
              Room Code: <span className="text-indigo-600">{roomCode}</span>
            </p>
          </div>

          {/* Join Button */}
          <div className="flex justify-center">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors text-white py-3 px-6 rounded-lg font-semibold shadow"
              onClick={handleJoin}
            >
              Start Quiz
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm mt-2">
            Prepare your quiz topic and invite friends!
          </div>
        </div>
      </div>
    );
  } else {
    return <SP Roomcode={roomCode} name={name} topic={topic} />;
  }
};

export default Createpage;
