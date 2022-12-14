const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const Chat = require("./models/chats");
const Products = require("./models/products");
const {
  userJoin,
  getCurrentUser,
  formatMessage,
  userLeave,
} = require("./scripts/users");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  },
});

// Commence le upload, a mettre avant layout et passport
app.use(upload.any());

//inserer la config de passport ici
require("./configs/passport")(passport);

app.use(expressLayouts);
// récupérer les posts (dans les requete.body)
app.use(express.urlencoded({ extended: false })); //middlewear
app.use(express.json()); // encore le body en json. Used for Fetch()

//creation de la session express
app.use(
  session({
    secret: "22HelloThereObiwanKenobi1991", //phrase supplementaire secret pour bloquer les pirates
    resave: true,
    saveUninitialized: true,
  })
);

//pour initialiser passport et relier a la session
app.use(passport.initialize());
app.use(passport.session());

//connection a flash
app.use(flash());

// quelques variables globales pour le bon fonctionnement de l'authentification
app.use((requete, reponse, next) => {
  reponse.locals.success_msg = requete.flash("success_msg");
  reponse.locals.erreur_msg = requete.flash("erreur_msg");
  reponse.locals.erreur_passport = requete.flash("error");
  next();
});

// mes routes
app.use("/", require("./routers/index"));
app.use("/users", require("./routers/users"));
app.use("/carts", require("./routers/carts"));
app.use("/chats", require("./routers/chats"));

//Statique route
app.use("/css", express.static("./styles"));
app.use("/pictures", express.static("./static/pictures"));

//mes vues
app.set("views", "./views");
app.set("layout", "layout");
app.set("view engine", "ejs");

//connexion BD
mongoose.connect(
  "mongodb+srv://projetintegration:integrationWeb@cluster0.rzx3q1e.mongodb.net/projetIntegration"
);
let db = mongoose.connection;
db.on("error", (err) => {
  console.error(`Database Error: ${err}`);
});
db.on("open", () => {
  console.log(`Connected to the Database`);
});

const botName = "Support Bot";

// Run when clients connect
io.on("connection", (socket) => {
  console.log("New WS Connection...");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Chat!"));

    // When a user connects / To Everyone but the client that's connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has join the chat`)
      );
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));

    //save chat to the database
    let chatMessage = new Chat({
      message: msg,
      sender: user.username,
      to: user.room,
    });

    chatMessage.save();
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }
  });
});

//create server et affiche a la console le port
server.listen(PORT, console.log(`Web démarré sur port : ${PORT}`));
