import express from "express";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const io = new Server(server);

const sockets = [];
const users = [];
const messages = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/lgin", (req, res) => {
  res.render("/chat/${req.body.username}");
});

app.get("/chat/:username", (req, res) => {
  res.render("chat", { username: req.params.username });
});

//er werd een nieuwe connection gedetecteerd
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    //voeg username toe aan lijst
    //verstuur 'join' bericht aan alle clients
  });

  socket.on("disconnect", (reason) => {
    //Haal username op van de dsicconnected user
    //Verwijder username en socket uit de lijsten
    //verstuur 'leave' bericht aan resterende clients
    //en geef naam vertrekkende gebruiker en lijst met actieve gebruikers mee
  });

  socket.on("message", (data) => {
    // Haal variabelen messanger en massage op uit data
    // Verstuur 'message' bericht naar alle clients
  });
});

io.on("connection", (socket) => {
  sockets[socket.id] = socket;

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("join", { username: username, users: Object.values(users) });
  });

  socket.on("disconnect", (reason) => {
    const username = users[socket.id];
    delete users[socket.id];
    delete sockets[socket.id];
    io.emit("leave", { username: username, users: Object.values(users) });
  });

  socket.on("message", (data) => {
    const { messenger, message } = data;
    io.emit("message", data);
  });
});
