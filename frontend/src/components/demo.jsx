import React from "react";

const demo = () => {
  return (
    <div className="bg-mainbg min-h-screen">
      <div className="bg-logoboard p-4 pl-6 flex shadow-2xl">
        <h1 className=" text-white font-logo text-3xl pr-250 ">QuizRush</h1>
        <h1 className=" text-white font-logo text-2xl ">RoomCode:-----</h1>
      </div>
      <div className="flex flex-row">
        <div className="basis-3/4 min-h-screen"></div>
        <div className="basis-1/4 bg-list min-h-screen "></div>
      </div>
    </div>
  );
};

export default demo;
