import React, { useState } from "react";
import SP from "./startpage";

const createpage = (props) => {
  const [Check, setCheck] = useState(0);
  const handlejoin = () => {
    setCheck(Check + 1);
  };
  if (!Check) {
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
                <div className="flex justify-center pb-10 font-extrabold">
                  RoomCode : {props.rc}
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
    return <SP Roomcode={props.rc} name={props.name} />;
  }
};

export default createpage;
