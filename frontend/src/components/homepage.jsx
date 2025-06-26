// import React, { useState } from "react";
// import CP from "./createpage";
// import Joinpage from "./Joinpage";
// import { useEffect } from "react";
// import { useRef } from "react";
// //import { Link } from "react-router-dom";

// const homepage = () => {
//   const [Name, setName] = useState("");
//   //const [Roomcode, setRoomcode] = useState("");
//   const [accept, setAccept] = useState(0);
//   const Roomcode = useRef("");
//   useEffect(() => {
//     console.log("Updated Roomcode:", Roomcode);
//   }, [accept]);

//   function generateRoomCode() {
//     if (Name === "") {
//       alert("Please enter your name......");
//       return;
//     }
//     //setAccept(accept + 2);
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let code = "";
//     for (let i = 0; i < 6; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return code;
//   }
//   const handlecreate = () => {
//     if (!Name) {
//       alert("Please enter your name......");
//       return;
//     }
//     const newCode = generateRoomCode();
//     Roomcode.current = newCode;
//     setAccept(accept + 2);
//     console.log(Roomcode);
//     localStorage.setItem("Roomcode", newCode);
//   };
//   function check() {
//     if (!Name) {
//       alert("Please enter your name......");
//       return;
//     }
//     setAccept(accept + 1);
//   }

//   {
//     switch (accept) {
//       case 0:
//         return (
//           <div className="bg-mainbg min-h-screen min-w-screen flex justify-center items-center font-body">
//             <div className=" rounded-2xl shadow-2xl  ">
//               <div className="text-2xl bg-logoboard w-xl rounded-2xl ">
//                 <div className="flex justify-center p-5 font-logo">
//                   <h1 className=" text-white font-logo text-3xl ">QuizRush</h1>
//                 </div>
//                 <div className="bg-amber-50 rounded-b-2xl ">
//                   <div className="flex justify-center p-7 font-medium ">
//                     <h1>Real-time quiz with friends!</h1>
//                   </div>
//                   <div className="flex justify-center pb-10">
//                     <input
//                       type="text"
//                       className="border-gray-400 border-1 rounded-md p-3 text-center"
//                       placeholder="Enter Your Name"
//                       value={Name}
//                       onChange={(e) => setName(e.target.value)}
//                     ></input>
//                   </div>
//                   <div className="flex justify-center gap-6 pb-15  rounded-2xl">
//                     <button
//                       className="bg-logoboard p-3 w-40 rounded-md cursor-pointer font-medium text-white"
//                       onClick={check}
//                     >
//                       Join Room
//                     </button>
//                     <button
//                       className="bg-logoboard p-2 rounded-md cursor-pointer font-medium text-white"
//                       onClick={handlecreate}
//                     >
//                       create Room
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div>
//             <Joinpage name={Name} />
//           </div>
//         );
//       case 2:
//         return (
//           <div>
//             <CP name={Name} rc={Roomcode.current} />
//           </div>
//         );
//     }
//   }
// };

// export default homepage;
import React, { useState, useEffect, useRef } from "react";
import CP from "./createpage";
import Joinpage from "./Joinpage";
import { useNavigate } from "react-router";

const Homepage = () => {
  const [name, setName] = useState("");
  const [accept, setAccept] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Updated Roomcode:", roomCode);
  }, [accept]);

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
    setAccept(accept + 2);
    console.log(roomCode);
    localStorage.setItem("Roomcode", newCode);
    navigate("/Create", { state: { a: name, b: newCode } });
  };

  const handleJoin = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    setAccept(accept + 1);
    navigate("/Join", { state: { a: name } });
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 min-h-screen flex justify-center items-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2 font-logo">
            QuizRush
          </h1>
          <p className="text-gray-700">Real-time quiz with friends!</p>
        </div>

        <div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-3 rounded-lg font-semibold"
            onClick={handleJoin}
          >
            Join Room
          </button>
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-3 rounded-lg font-semibold"
            onClick={handleCreate}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
