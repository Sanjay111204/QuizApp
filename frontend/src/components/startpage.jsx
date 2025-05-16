import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const socket = io("ws://localhost:1112");

const startpage = (props) => {
  const [StartTime, setStartTime] = useState(30);
  const [players, setplayers] = useState([]);
  const [playerslist, setplayerslist] = useState([]);
  const [question, setquestion] = useState([]);
  const [options, setoptions] = useState([]);
  const [questionTimer, setquestionTimer] = useState(0);
  const [option1, setoption1] = useState("bg-list");
  const [option2, setoption2] = useState("bg-list");
  const [option3, setoption3] = useState("bg-list");
  const [option4, setoption4] = useState("bg-list");
  const [overall, setoverall] = useState(0);
  const [answer, setanswer] = useState("");
  const [winners, setwinnners] = useState([]);
  let questioncurrent = [];

  useEffect(() => {
    socket.emit("joinroom", props.Roomcode, props.name);
  }, [props.Roomcode, props.name]);
  useEffect(() => {
    const handleMessage = (data) => {
      toast.success(`${data} has joined`);
      players.push(data);
    };
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
    return () => {};
  }, [players]);

  useEffect(() => {
    socket.on("PlayersList", (data) => {
      setplayerslist(data);
    });
    return () => {};
  }, [playerslist]);

  useEffect(() => {
    socket.on("startTimer", (data) => {
      setStartTime(data);
    });

    return () => {};
  }, [StartTime]);
  // useEffect(() => {
  //   socket.on("PlayersList", (list) => {
  //     setplayers(list);
  //   });
  //   return () => {};
  // }, [players]);

  // useEffect(() => {
  //   const handleQuestion = (data) => {
  //     console.log("Received question:", data);
  //     setquestions(data); // ✅ correct state
  //   };

  //   socket.on("question", handleQuestion);
  //   setoption1("bg-list");
  //   setoption2("bg-list");
  //   setoption3("bg-list");
  //   setoption4("bg-list");
  //   setoverall(0);
  //   //setStartTime(-1);
  //   return () => {};
  // }, [questions]);

  useEffect(() => {
    socket.on("Sending question", (que) => {
      setquestion(que);
    });
    return () => {};
  }, [question]);

  useEffect(() => {
    socket.on("Sending options", (op) => {
      setoptions(op);
      setoption1("bg-list");
      setoption2("bg-list");
      setoption3("bg-list");
      setoption4("bg-list");
      setoverall(0);
    });
    return () => {};
  }, [options]);

  useEffect(() => {
    socket.on("Sending answer", (ans) => {
      setanswer(ans);
    });
    return () => {};
  }, [answer]);

  useEffect(() => {
    socket.on("questionTimer", (data) => {
      setquestionTimer(data);
    });

    return () => {};
  }, [questionTimer]);
  useEffect(() => {
    socket.on("final", (arr) => {
      setwinnners(arr);
    });
    return () => {};
  }, [winners]);

  function handleanswer(option, index) {
    // if (option === questions.answer) {
    //   console.log(option);
    // } else {
    //   console.log("wrong");
    // }
    if (overall === 1) {
      alert("Your answer is already submitted...");
      return;
    }
    if (option === answer) {
      console.log("correct");
      socket.emit("Points", props.name);
      if (index === 0) setoption1("bg-green-500");
      if (index === 1) setoption2("bg-green-500");
      if (index === 2) setoption3("bg-green-500");
      if (index === 3) setoption4("bg-green-500");
    } else {
      console.log("wrong");
      if (index === 0) setoption1("bg-red-500");
      if (index === 1) setoption2("bg-red-500");
      if (index === 2) setoption3("bg-red-500");
      if (index === 3) setoption4("bg-red-500");
      //console.log(option1);
    }
    setoverall(1);
  }
  // function xyz() {
  //   if (winners.size() === 1) return "Winner is ";
  //   else return "Winners are ";
  // }
  if (winners[0]) {
    return (
      <div className="bg-mainbg min-h-screen">
        <div className="bg-logoboard p-4 pl-6 flex shadow-2xl">
          <h1 className=" text-white font-logo text-3xl pr-250 ">QuizRush</h1>
          <h1 className=" text-white font-logo text-2xl ">
            RoomCode: {props.Roomcode}
          </h1>
        </div>
        <div className="flex flex-row">
          <div className="basis-3/4 min-h-screen align-middle items-center  justify-center flex ">
            <div className="flex justify-center items-center align-middle font-logo text-white">
              <div>
                <h2 className="text-5xl p-2 pt-4">WINNERS</h2>
                <br />
                <br />
                <ol className="text-4xl  justify-center pl-10 list-disc ">
                  {winners.map((player, index) => (
                    <li key={index}>{player}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="basis-1/4 bg-list h-screen overflow-scroll overscroll-auto font-logo text-white ">
            <div className="flex justify-center ">
              <div>
                <h2 className="text-5xl p-2 pt-4">Players</h2>
                <br />
                <br />
                <ol className="text-2xl  justify-center pl-10 list-disc ">
                  {playerslist.map((player, index) => (
                    <li key={index}>
                      {player.Name} : {player.Score}{" "}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  } else if (StartTime > 0) {
    return (
      <div className="bg-mainbg min-h-screen">
        <div className="bg-logoboard p-4 pl-6 flex shadow-2xl">
          <h1 className=" text-white font-logo text-3xl pr-250 ">QuizRush</h1>
          <h1 className=" text-white font-logo text-2xl ">
            RoomCode: {props.Roomcode}
          </h1>
        </div>
        <div className="flex flex-row">
          <div className="basis-3/4 min-h-screen align-middle items-center  justify-center flex ">
            <div className="font-logo text-3xl text-white">
              Quiz starts in {StartTime} seconds...
            </div>
          </div>
          <div className="basis-1/4 bg-list h-screen overflow-scroll overscroll-auto font-logo text-white ">
            <div className="flex justify-center ">
              <div>
                <h2 className="text-5xl p-2 pt-4">Players</h2>
                <br />
                <br />
                <ol className="text-2xl  justify-center pl-10 list-disc ">
                  {playerslist.map((player, index) => (
                    <li key={index}>
                      {player.Name} : {player.Score}{" "}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  } else {
    return (
      <div className="bg-mainbg min-h-screen">
        <div className="bg-logoboard p-4 pl-6 flex shadow-2xl">
          <h1 className=" text-white font-logo text-3xl pr-250 ">QuizRush</h1>
          <h1 className=" text-white font-logo text-2xl ">
            RoomCode: {props.Roomcode}
          </h1>
        </div>
        <div className="flex flex-row">
          <div className="basis-3/4 min-h-screen align-middle items-center  justify-center  ">
            <div className=" flex justify-center align-middle items-center">
              <div className="font-logo text-3xl text-white rounded-md p-5 m-5 w-250 text-center mt-10">
                Time Remaining : {questionTimer}
              </div>
            </div>
            <div className=" flex justify-center align-middle items-center">
              <div className="font-logo text-3xl text-white bg-list rounded-md p-10 m-5 w-250 text-center mt-10">
                {question}
              </div>
            </div>
            <div className=" flex justify-center align-middle items-center">
              <div
                className={`font-logo text-2xl text-white ${option1} rounded-md p-5 m-5 w-200 hover:cursor-pointer ${
                  option1 === "bg - logo" ? "hover : bg - logoboard" : ""
                } `}
                onClick={() => handleanswer(options[0], 0)}
              >
                {options[0]}
              </div>
            </div>
            <div className=" flex justify-center align-middle items-center">
              <div
                className={`font-logo  text-2xl text-white ${option2} rounded-md p-5 m-5 w-200 hover:cursor-pointer ${
                  option2 === "bg - logo" ? "hover : bg - logoboard" : ""
                } `}
                onClick={() => handleanswer(options[1], 1)}
              >
                {options[1]}
              </div>
            </div>
            <div className=" flex justify-center align-middle items-center">
              <div
                className={`font-logo text-2xl text-white ${option3} rounded-md p-5 m-5 w-200 hover:cursor-pointer ${
                  option3 === "bg - logo" ? "hover : bg - logoboard" : ""
                } `}
                onClick={() => handleanswer(options[2], 2)}
              >
                {options[2]}
              </div>
            </div>
            <div className=" flex justify-center align-middle items-center">
              <div
                className={`font-logo text-2xl text-white ${option4} rounded-md p-5 m-5 w-200 hover:cursor-pointer${
                  option4 === "bg - logo" ? "hover : bg - logoboard" : ""
                } `}
                onClick={() => handleanswer(options[3], 3)}
              >
                {options[3]}
              </div>
            </div>
          </div>
          <div className="basis-1/4 bg-list h-screen overflow-scroll overscroll-auto font-logo text-white ">
            <div className="flex justify-center ">
              <div>
                <h2 className="text-5xl p-2 pt-4">Players</h2>
                <br />
                <br />
                <ol className="text-2xl justify-center pl-10 list-disc ">
                  {playerslist.map((player, index) => (
                    <li key={index}>
                      {player.Name} : {player.Score}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default startpage;
