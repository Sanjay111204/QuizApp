import React, { useState, useEffect } from "react";
import CP from "./createpage";
import Joinpage from "./Joinpage";
import { useNavigate } from "react-router";

const Homepage = () => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Updated Roomcode:", roomCode);
  }, [roomCode]);

  const generateRoomCode = () => {
    if (name === "") {
      alert("Please enter your name.");
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    localStorage.setItem("Roomcode", newCode);
    navigate("/Create", { state: { a: name, b: newCode } });
  };

  const handleJoin = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    navigate("/Join", { state: { a: name } });
  };

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

        {/* Name Input */}
        <div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-center shadow-sm placeholder-gray-400"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors text-white py-3 rounded-lg font-semibold shadow"
            onClick={handleJoin}
          >
            Join Room
          </button>
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors text-white py-3 rounded-lg font-semibold shadow"
            onClick={handleCreate}
          >
            Create Room
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-400 text-sm mt-2">
          Questions, Made Smarter with AI.
        </div>
      </div>
    </div>
  );
};

export default Homepage;
