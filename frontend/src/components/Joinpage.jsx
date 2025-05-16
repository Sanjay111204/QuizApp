import React from "react";
import { useState } from "react";
import SP from "./startpage";

const Joinpage = (props) => {
  const [Roomcode, setRoomcode] = useState("");
  const [check, setcheck] = useState(0);
  function handlejoin() {
    if (Roomcode == " ") {
      alert("Please enter RoomCode...");
      return;
    }
    setcheck(check + 1);
  }
  if (!check) {
    return (
      <div>
        <div className="bg-mainbg min-h-screen min-w-screen flex justify-center items-center font-body">
          <div className=" rounded-2xl shadow-2xl  ">
            <div className="text-2xl bg-logoboard w-xl rounded-2xl ">
              <div className="flex justify-center p-5 font-logo">
                <h1 className=" text-white font-logo text-3xl ">QuizRush</h1>
              </div>
              <div className="bg-amber-50 rounded-b-2xl ">
                <div className="flex justify-center p-7 font-medium ">
                  <h1>Real-time quiz with friends!</h1>
                </div>
                <div className="flex justify-center pb-10 font-medium ">
                  Name : {props.name}
                </div>
                <div className="flex justify-center pb-10">
                  <input
                    type="text"
                    className="border-gray-400 border-1 rounded-md p-3 text-center"
                    placeholder="Enter RoomCode"
                    value={Roomcode}
                    onChange={(e) => setRoomcode(e.target.value)}
                  ></input>
                </div>
                <div className="flex justify-center gap-6 pb-15  rounded-2xl">
                  <button
                    className="bg-logoboard p-2 rounded-md cursor-pointer font-medium text-white"
                    onClick={handlejoin}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <SP Roomcode={Roomcode} name={props.name} />;
  }
};

export default Joinpage;
