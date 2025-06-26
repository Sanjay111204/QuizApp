// import React, { useState } from "react";
// import SP from "./startpage";

// const createpage = (props) => {
//   const [Check, setCheck] = useState(0);
//   const handlejoin = () => {
//     setCheck(Check + 1);
//   };
//   if (!Check) {
//     return (
//       <div>
//         <div className="bg-mainbg min-h-screen min-w-screen flex justify-center items-center font-body">
//           <div className=" rounded-2xl shadow-2xl  ">
//             <div className="text-2xl bg-logoboard w-xl rounded-2xl ">
//               <div className="flex justify-center p-5 font-logo">
//                 <h1 className=" text-white font-logo text-3xl ">QuizRush</h1>
//               </div>
//               <div className="bg-amber-50 rounded-b-2xl ">
//                 <div className="flex justify-center p-7 font-medium ">
//                   <h1>Real-time quiz with friends!</h1>
//                 </div>
//                 <div className="flex justify-center pb-10 font-medium ">
//                   Name : {props.name}
//                 </div>
//                 <div className="flex justify-center pb-10 font-extrabold">
//                   RoomCode : {props.rc}
//                 </div>
//                 <div className="flex justify-center gap-6 pb-15  rounded-2xl">
//                   <button
//                     className="bg-logoboard p-2 rounded-md cursor-pointer font-medium text-white"
//                     onClick={handlejoin}
//                   >
//                     Join Room
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     return <SP Roomcode={props.rc} name={props.name} />;
//   }
// };

// export default createpage;
import React, { useState } from "react";
import SP from "./startpage";
import { useLocation } from "react-router";
import { useEffect } from "react";

const Createpage = (props) => {
  const [check, setCheck] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const [name, setname] = useState("");
  const loc = useLocation();
  useEffect(() => {
    const { a, b } = loc.state || {};
    a;
    setRoomCode(b);
    setname(a);
  }, [loc]);

  const handleJoin = () => {
    setCheck(check + 1);
  };

  if (!check) {
    return (
      <div className="bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 min-h-screen flex justify-center items-center font-sans p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-2 font-logo">
              QuizRush
            </h1>
            <p className="text-gray-700">Real-time quiz with friends!</p>
          </div>

          <div className="text-center font-medium text-gray-800">
            <p>
              Name: <span className="font-semibold">{name}</span>
            </p>
          </div>

          <div className="text-center font-bold text-gray-900">
            <p>
              Room Code: <span className="text-indigo-600">{roomCode}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-3 px-6 rounded-lg font-semibold"
              onClick={handleJoin}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <SP Roomcode={roomCode} name={name} />;
  }
};

export default Createpage;
