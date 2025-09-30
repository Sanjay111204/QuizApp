import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("https://quizrush.onrender.com");

const Startpage = (props) => {
  const [StartTime, setStartTime] = useState(0);
  const [playerslist, setplayerslist] = useState([]);
  const [question, setquestion] = useState("");
  const [options, setoptions] = useState([]);
  const [questionTimer, setquestionTimer] = useState(10);
  const [optionColors, setOptionColors] = useState([
    "bg-gray-700",
    "bg-gray-700",
    "bg-gray-700",
    "bg-gray-700",
  ]);
  const [answered, setAnswered] = useState(false);
  const [answer, setanswer] = useState("");
  const [winners, setwinners] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    socket.emit("joinroom", props.Roomcode, props.name, props.topic);
  }, [props.Roomcode, props.name]);

  useEffect(() => {
    const handleMessage = (data) => toast.success(`${data} has joined`);
    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, []);

  useEffect(() => socket.on("PlayersList", setplayerslist), []);
  useEffect(
    () =>
      socket.on("startTimer", (time) => {
        setStartTime(time);
        setGenerating(false);
        setError(false);
      }),
    []
  );
  useEffect(() => socket.on("Sending question", setquestion), []);
  useEffect(
    () =>
      socket.on("Sending options", (op) => {
        setoptions(op);
        setOptionColors([
          "bg-gray-700",
          "bg-gray-700",
          "bg-gray-700",
          "bg-gray-700",
        ]);
        setAnswered(false);
      }),
    []
  );
  useEffect(() => socket.on("Sending answer", setanswer), []);
  useEffect(() => socket.on("questionTimer", setquestionTimer), []);
  useEffect(() => socket.on("final", setwinners), []);
  useEffect(() => socket.on("error", () => setError(true)), []);
  useEffect(() => socket.on("message", () => setGenerating(true)), []);

  const handleAnswer = (option, index) => {
    if (answered) {
      toast.info("You have already submitted your answer!");
      return;
    }
    const newColors = [...optionColors];
    if (option === answer) {
      socket.emit("Points", props.name);
      newColors[index] = "bg-green-600";
    } else {
      newColors[index] = "bg-red-600";
    }
    setOptionColors(newColors);
    setAnswered(true);
  };

  const Header = () => (
    <div className="bg-gradient-to-r from-indigo-800 to-blue-700 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-white font-logo text-3xl font-bold">QuizRush</h1>
      <h2 className="text-white font-logo text-xl font-semibold">
        Room Code: {props.Roomcode}
      </h2>
    </div>
  );

  const PlayerSidebar = () => (
    <div className="basis-1/4 bg-gray-900 h-screen overflow-y-auto text-white font-logo p-6 shadow-inner">
      <h2 className="text-3xl mb-4 text-center border-b border-gray-700 pb-2">
        Players
      </h2>
      <ul className="space-y-3 text-lg">
        {playerslist.map((player, index) => (
          <li key={index}>
            {player.Name} : <span className="font-bold">{player.Score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  const StatusMessage = ({ msg }) => (
    <div className="flex-1 flex items-center justify-center py-10">
      <h2 className="text-3xl font-logo text-indigo-500 font-semibold">
        {msg}
      </h2>
    </div>
  );

  const MainContent = () => {
    if (generating)
      return (
        <StatusMessage msg="Generating Questions... Please Wait..(60 sec)" />
      );
    else if (error)
      return (
        <StatusMessage msg="Error Generating Questions. Please Try Again." />
      );
    else if (winners.length > 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <h2 className="text-5xl font-bold text-indigo-500 mb-6">
            🏆 Winners
          </h2>
          <ul className="text-3xl space-y-3">
            {winners.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      );
    } else if (StartTime > 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <h2 className="text-3xl text-indigo-500 font-semibold">
            🚀 Quiz starts in <span className="text-red-500">{StartTime}</span>{" "}
            seconds
          </h2>
        </div>
      );
    } else {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-6">
          <div className="text-xl font-semibold text-indigo-500">
            ⏱️ Time Remaining:{" "}
            <span className="text-red-500 font-bold">{questionTimer}</span>{" "}
            seconds
          </div>
          <div className="text-2xl bg-gray-600 text-white rounded-lg p-8 w-200 text-center shadow-lg">
            {question}
          </div>
          {options.map((opt, i) => (
            <div
              key={i}
              className={`text-xl font-medium text-white ${optionColors[i]} rounded-md p-4 w-130 text-center cursor-pointer transform transition-colors duration-300 hover:scale-105`}
              onClick={() => handleAnswer(opt, i)}
            >
              {opt}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-indigo-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <MainContent />
        <PlayerSidebar />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Startpage;
