const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const path = require("path");
const { Socket } = require("socket.io-client");

const app = express();
const server = http.createServer(app);

const __direname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate(Topic) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ` generate 20 questions on ${Topic} for a quiz in the formate of array of objects with each object containing question, options(4 options) and answer. make sure the answer is one of the options.the response should start with [ and end with ] so that it can be parsed as json array directly.`,
  });
  let raw = response.text.trim();

  raw = raw.slice(7, -3).trim();

  let data;
  try {
    data = JSON.parse(raw);
    // console.log("Parsed data:", data);
  } catch (err) {
    console.error("JSON parse error:", err);
    console.error("Raw data that failed to parse:", raw);
    return []; // fallback to empty array
  }

  return data;
}

// ================== Questions ==================

// ================== State ==================
const questions = [];
const Rooms = [];
const Timer = [];
const players = [];

// ================== Helpers ==================
function sendquestion(room, questionindex) {
  if (questionindex === 20) {
    let winner = [];
    let maxScore = 0;

    for (const p of players[room].list) {
      if (p.Score > maxScore) {
        winner = [p.Name];
        maxScore = p.Score;
      } else if (p.Score === maxScore) {
        winner.push(p.Name);
      }
    }

    io.to(room).emit("final", winner);
    return;
  }

  const q = questions[room][questionindex];
  io.to(room).emit("Sending question", q.question);
  io.to(room).emit("Sending options", q.options);
  io.to(room).emit("Sending answer", q.answer);

  let x = 10;
  const intervalid1 = setInterval(() => {
    io.to(room).emit("questionTimer", x);
    x--;

    if (x < 0) {
      io.to(room).emit("questionTimer", 10);
      clearInterval(intervalid1);
      sendquestion(room, questionindex + 1);
    }
  }, 1000);
}

// ================== Socket.IO ==================
io.on("connection", (socket) => {
  console.log("a new user connected");

  socket.on("joinroom", async (room, name, Topic) => {
    console.log("called");
    socket.join(room);
    io.to(room).emit("message", name);

    if (!players[room]) {
      players[room] = { list: [] };
    }
    players[room].list.push({ Name: name, Score: 0 });
    io.to(room).emit("PlayersList", players[room].list);

    if (!Timer[room]) {
      Timer[room] = { time: 30 };
      try {
        io.to(room).emit("generating", "Generating questions...");
        questions[room] = await generate(Topic);
        if (questions[room].length !== 20) {
          throw new Error("Invalid questions format");
        }
      } catch (err) {
        io.to(room).emit(
          "error",
          "Error generating questions, using default questions"
        );
      }
      const intervalid = setInterval(() => {
        Timer[room].time--;
        io.to(room).emit("startTimer", Timer[room].time);

        if (Timer[room].time <= 0) {
          clearInterval(intervalid);

          if (!Rooms[room]) {
            Rooms[room] = { current_question: 0, time: 10 };
          }
          sendquestion(room, Rooms[room].current_question);
        }
      }, 1000);
    } else {
      io.to(room).emit("generating", "Generating questions...");
    }

    socket.on("Points", (name) => {
      const p = players[room].list.find((x) => x.Name === name);
      if (p) p.Score++;
      io.to(room).emit("PlayersList", players[room].list);
    });
  });
});

app.use(express.static(path.join(__direname, "/frontend/dist")));
app.get("*name", (_, res) => {
  res.sendFile(path.resolve(__direname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 1112;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);

// // ================== Middleware ==================
// app.use(
//   cors({
//     origin: "https://quizrush.onrender.com/",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// // ================== Socket.IO ==================
// const io = new Server(server, {
//   cors: {
//     origin: "https://quizrush.onrender.com/",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // ================== Game Config ==================
// const QUESTION_TIME = 10; // seconds per question
// const START_DELAY = 30; // seconds before quiz starts
// const TOTAL_QUESTIONS = 20; // total questions per game

// // ================== State ==================
// const rooms = {}; // { roomId: { currentQuestion } }
// const players = {}; // { roomId: [ { Name, Score } ] }

// // ================== Questions ==================
// const questions = [
//   {
//     question: "What is the time complexity of binary search?",
//     options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
//     answer: "O(log n)",
//   },
//   {
//     question: "Which data structure uses FIFO (First In First Out)?",
//     options: ["Stack", "Queue", "Tree", "Graph"],
//     answer: "Queue",
//   },
//   {
//     question: "Which language is considered low-level?",
//     options: ["Python", "Java", "Assembly", "C#"],
//     answer: "Assembly",
//   },
//   {
//     question: "What does 'HTTP' stand for?",
//     options: [
//       "HyperText Transfer Protocol",
//       "High Transfer Text Protocol",
//       "Hyperlink Transfer Protocol",
//       "Host Transfer Text Protocol",
//     ],
//     answer: "HyperText Transfer Protocol",
//   },
//   {
//     question: "Which of the following is not an OOP principle?",
//     options: ["Encapsulation", "Abstraction", "Inheritance", "Compilation"],
//     answer: "Compilation",
//   },
//   {
//     question: "What is the main purpose of a DNS server?",
//     options: [
//       "Store passwords",
//       "Translate domain names to IP addresses",
//       "Control bandwidth",
//       "Serve ads",
//     ],
//     answer: "Translate domain names to IP addresses",
//   },
//   {
//     question: "Which of these is a non-volatile memory?",
//     options: ["RAM", "Cache", "ROM", "Registers"],
//     answer: "ROM",
//   },
//   {
//     question: "Which logic gate returns true only if both inputs are true?",
//     options: ["OR", "XOR", "NAND", "AND"],
//     answer: "AND",
//   },
//   {
//     question: "What is a deadlock in operating systems?",
//     options: [
//       "Infinite loop",
//       "Memory leak",
//       "Two processes waiting for each other indefinitely",
//       "Race condition",
//     ],
//     answer: "Two processes waiting for each other indefinitely",
//   },
//   {
//     question: "Which one is a NoSQL database?",
//     options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
//     answer: "MongoDB",
//   },
//   {
//     question: "What is the purpose of a compiler?",
//     options: [
//       "Execute code",
//       "Interpret code line by line",
//       "Convert high-level code to machine code",
//       "Debug code",
//     ],
//     answer: "Convert high-level code to machine code",
//   },
//   {
//     question: "What kind of data structure is a binary heap?",
//     options: ["Graph", "Tree", "Array", "Queue"],
//     answer: "Tree",
//   },
//   {
//     question: "Which algorithm is used to find the shortest path in a graph?",
//     options: [
//       "Kruskal’s Algorithm",
//       "DFS",
//       "Prim’s Algorithm",
//       "Dijkstra’s Algorithm",
//     ],
//     answer: "Dijkstra’s Algorithm",
//   },
//   {
//     question: "Which of these is a system call in OS?",
//     options: ["fork()", "printf()", "scanf()", "strlen()"],
//     answer: "fork()",
//   },
//   {
//     question: "In databases, what does ACID stand for?",
//     options: [
//       "Atomicity, Consistency, Isolation, Durability",
//       "Accuracy, Consistency, Integrity, Durability",
//       "Atomicity, Connectivity, Isolation, Data",
//       "Access, Control, Integrity, Durability",
//     ],
//     answer: "Atomicity, Consistency, Isolation, Durability",
//   },
//   {
//     question: "Which one is a linear data structure?",
//     options: ["Tree", "Graph", "Queue", "Trie"],
//     answer: "Queue",
//   },
//   {
//     question: "Which sorting algorithm is NOT comparison-based?",
//     options: ["Quick Sort", "Merge Sort", "Radix Sort", "Heap Sort"],
//     answer: "Radix Sort",
//   },
//   {
//     question: "Which protocol is used to send emails?",
//     options: ["HTTP", "SMTP", "FTP", "IMAP"],
//     answer: "SMTP",
//   },
//   {
//     question: "Which OS layer interacts directly with hardware?",
//     options: ["Shell", "Application", "Kernel", "File System"],
//     answer: "Kernel",
//   },
//   {
//     question: "Which number system is used by computers?",
//     options: ["Decimal", "Octal", "Hexadecimal", "Binary"],
//     answer: "Binary",
//   },
// ];

// // ================== Helpers ==================
// function getWinner(roomId) {
//   const scores = players[roomId] || [];
//   if (!scores.length) return [];

//   const maxScore = Math.max(...scores.map((p) => p.Score));
//   return scores.filter((p) => p.Score === maxScore).map((p) => p.Name);
// }

// function sendQuestion(roomId, index) {
//   if (index >= TOTAL_QUESTIONS) {
//     const winners = getWinner(roomId);
//     io.to(roomId).emit("final", winners);

//     // cleanup
//     delete rooms[roomId];
//     delete players[roomId];
//     return;
//   }

//   const q = questions[index];
//   io.to(roomId).emit("question", {
//     question: q.question,
//     options: q.options,
//     answer: q.answer,
//   });

//   let timeLeft = QUESTION_TIME;
//   const qInterval = setInterval(() => {
//     io.to(roomId).emit("questionTimer", timeLeft);
//     timeLeft--;

//     if (timeLeft < 0) {
//       clearInterval(qInterval);
//       rooms[roomId].currentQuestion++;
//       sendQuestion(roomId, rooms[roomId].currentQuestion);
//     }
//   }, 1000);
// }

// // ================== Socket Events ==================
// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);

//   socket.on("joinroom", (roomId, name) => {
//     socket.join(roomId);

//     if (!players[roomId]) players[roomId] = [];
//     players[roomId].push({ Name: name, Score: 0 });

//     io.to(roomId).emit("PlayersList", players[roomId]);

//     if (!rooms[roomId]) {
//       rooms[roomId] = { currentQuestion: 0 };
//       let timeLeft = START_DELAY;

//       const startInterval = setInterval(() => {
//         io.to(roomId).emit("startTimer", timeLeft);
//         timeLeft--;

//         if (timeLeft < 0) {
//           clearInterval(startInterval);
//           sendQuestion(roomId, rooms[roomId].currentQuestion);
//         }
//       }, 1000);
//     }
//   });

//   socket.on("Points", (roomId, name) => {
//     let player = players[roomId]?.find((p) => p.Name === name);
//     if (player) player.Score++;
//     io.to(roomId).emit("PlayersList", players[roomId]);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // ================== Static Files ==================
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*name", (_, res) => {
//   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// });

// // ================== Start Server ==================
// const PORT = process.env.PORT || 1112;
// server.listen(PORT, () => {
//   console.log(`✅ Server listening on port ${PORT}`);
// });
