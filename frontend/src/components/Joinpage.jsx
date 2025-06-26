// import React from "react";
// import { useState } from "react";
// import SP from "./startpage";

// const Joinpage = (props) => {
//   const [Roomcode, setRoomcode] = useState("");
//   const [check, setcheck] = useState(0);
//   function handlejoin() {
//     if (Roomcode == " ") {
//       alert("Please enter RoomCode...");
//       return;
//     }
//     setcheck(check + 1);
//   }
//   if (!check) {
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
//                 <div className="flex justify-center pb-10">
//                   <input
//                     type="text"
//                     className="border-gray-400 border-1 rounded-md p-3 text-center"
//                     placeholder="Enter RoomCode"
//                     value={Roomcode}
//                     onChange={(e) => setRoomcode(e.target.value)}
//                   ></input>
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
//     return <SP Roomcode={Roomcode} name={props.name} />;
//   }
// };

// export default Joinpage;
import React, { useState } from "react";
import SP from "./startpage";
import { useLocation } from "react-router";
import { useEffect } from "react";

const Joinpage = (props) => {
  const [roomCode, setRoomCode] = useState("");
  const [check, setCheck] = useState(0);
  const [name, setname] = useState("");
  const loc = useLocation();
  useEffect(() => {
    const { a } = loc.state || {};
    setname(a);
  }, [loc]);

  const handleJoin = () => {
    if (!roomCode.trim()) {
      alert("Please enter Room Code...");
      return;
    }
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
            <p className="text-gray-700">Ready to join a live quiz room?</p>
          </div>

          <div className="text-center font-medium text-gray-800">
            <p>
              👤 <strong>Name:</strong> {name}
            </p>
          </div>

          <div className="text-center">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
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

export default Joinpage;
