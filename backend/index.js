const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
//const { Socket } = require("socket.io-client");

const app = express();
const server = http.createServer(app);

const __direname = path.resolve();

app.use(
  cors({
    origin: "https://quizrush.onrender.com/",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://quizrush.onrender.com/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const questions = [
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)",
  },
  {
    question: "Which data structure uses FIFO (First In First Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
  },
  {
    question: "Which language is considered low-level?",
    options: ["Python", "Java", "Assembly", "C#"],
    answer: "Assembly",
  },
  {
    question: "What does 'HTTP' stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyperlink Transfer Protocol",
      "Host Transfer Text Protocol",
    ],
    answer: "HyperText Transfer Protocol",
  },
  {
    question: "Which of the following is not an OOP principle?",
    options: ["Encapsulation", "Abstraction", "Inheritance", "Compilation"],
    answer: "Compilation",
  },
  {
    question: "What is the main purpose of a DNS server?",
    options: [
      "Store passwords",
      "Translate domain names to IP addresses",
      "Control bandwidth",
      "Serve ads",
    ],
    answer: "Translate domain names to IP addresses",
  },
  {
    question: "Which of these is a non-volatile memory?",
    options: ["RAM", "Cache", "ROM", "Registers"],
    answer: "ROM",
  },
  {
    question: "Which logic gate returns true only if both inputs are true?",
    options: ["OR", "XOR", "NAND", "AND"],
    answer: "AND",
  },
  {
    question: "What is a deadlock in operating systems?",
    options: [
      "Infinite loop",
      "Memory leak",
      "Two processes waiting for each other indefinitely",
      "Race condition",
    ],
    answer: "Two processes waiting for each other indefinitely",
  },
  {
    question: "Which one is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    answer: "MongoDB",
  },
  {
    question: "What is the purpose of a compiler?",
    options: [
      "Execute code",
      "Interpret code line by line",
      "Convert high-level code to machine code",
      "Debug code",
    ],
    answer: "Convert high-level code to machine code",
  },
  {
    question: "What kind of data structure is a binary heap?",
    options: ["Graph", "Tree", "Array", "Queue"],
    answer: "Tree",
  },
  {
    question: "Which algorithm is used to find the shortest path in a graph?",
    options: [
      "Kruskal’s Algorithm",
      "DFS",
      "Prim’s Algorithm",
      "Dijkstra’s Algorithm",
    ],
    answer: "Dijkstra’s Algorithm",
  },
  {
    question: "Which of these is a system call in OS?",
    options: ["fork()", "printf()", "scanf()", "strlen()"],
    answer: "fork()",
  },
  {
    question: "In databases, what does ACID stand for?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Consistency, Integrity, Durability",
      "Atomicity, Connectivity, Isolation, Data",
      "Access, Control, Integrity, Durability",
    ],
    answer: "Atomicity, Consistency, Isolation, Durability",
  },
  {
    question: "Which one is a linear data structure?",
    options: ["Tree", "Graph", "Queue", "Trie"],
    answer: "Queue",
  },
  {
    question: "Which sorting algorithm is NOT comparison-based?",
    options: ["Quick Sort", "Merge Sort", "Radix Sort", "Heap Sort"],
    answer: "Radix Sort",
  },
  {
    question: "Which protocol is used to send emails?",
    options: ["HTTP", "SMTP", "FTP", "IMAP"],
    answer: "SMTP",
  },
  {
    question: "Which OS layer interacts directly with hardware?",
    options: ["Shell", "Application", "Kernel", "File System"],
    answer: "Kernel",
  },
  {
    question: "Which number system is used by computers?",
    options: ["Decimal", "Octal", "Hexadecimal", "Binary"],
    answer: "Binary",
  },
];
function count(time, id) {
  if (time == 0) {
    clearInterval(id);
    return;
  }
  console.log(time);
  return time - 1;
}
const Rooms = [];
const Timer = [];
const players = [];
io.on("connection", (socket) => {
  console.log("a new user connected");
  socket.on("joinroom", (room, name) => {
    console.log("called");
    socket.join(room);
    io.to(room).emit("message", name);
    if (!players[room]) {
      players[room] = {
        list: [],
      };
    }
    players[room].list.push({ Name: name, Score: 0 });
    io.to(room).emit("PlayersList", players[room].list);
    function sendquestion(room, questionindex) {
      console.log("doing");
      if (questionindex === 20) {
        let winner = [];
        let s = 0;
        for (let i = 0; i < players[room].list.length; i++) {
          if (players[room].list[i].Score > s) {
            winner = [players[room].list[i].Name];
            s = players[room].list[i].Score;
          } else if (players[room].list[i].Score === s) {
            winner.push(players[room].list[i].Name);
          }
        }
        io.to(room).emit("final", winner);
        delete players[room];
        delete Timer[room];
        delete Rooms[room];
        return;
      }
      io.to(room).emit("Sending question", questions[questionindex].question);
      io.to(room).emit("Sending options", questions[questionindex].options);
      io.to(room).emit("Sending answer", questions[questionindex].answer);
      let x = 10;
      const intervalid1 = setInterval(() => {
        x = x - 1;
        console.log(x);
        io.to(room).emit("questionTimer", x);

        if (x <= 0) {
          clearInterval(intervalid1);
          sendquestion(room, questionindex + 1);
        }
      }, 1000);
    }
    if (!Timer[room]) {
      Timer[room] = {
        time: 30,
      };
      const intervalid = setInterval(() => {
        Timer[room].time = Timer[room].time - 1;
        console.log(Timer[room].time);
        io.to(room).emit("startTimer", Timer[room].time);
        if (Timer[room].time <= 0) {
          clearInterval(intervalid);
          if (!Rooms[room]) {
            Rooms[room] = {
              current_question: 0,
              time: 10,
            };
          }
          sendquestion(room, Rooms[room].current_question);
        }
      }, 1000);
    }
    socket.on("Points", (name) => {
      let p = players[room].list.find((x) => x.Name === name);
      if (p) {
        p.Score = p.Score + 1;
      }
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
