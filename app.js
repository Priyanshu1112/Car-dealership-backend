require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dbconnection = require("./Config/Dbconfiguration");

// Initialize database connection
dbconnection();
// fetchAndUpdateNews()
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://car-dealership-frontend.vercel.app",
    ],
    credentials: true,
  },
});
//file upload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//stripe

//logger
const logger = require("morgan");
app.use(logger("tiny"));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://car-dealership-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// Routes
app.use("/", require("./Routes/index"));
app.use("/admin", require("./Routes/admin"));
app.use("/car", require("./Routes/cars"));
app.use("/review", require("./Routes/review"));
app.use("/buyer", require("./Routes/buyer"));
app.use("/dealer", require("./Routes/dealer"));
app.use("/deal", require("./Routes/deal"));

//ErrorHandling
const ErrorHandler = require("./Utils/ErrorHandler");
const { generatedError } = require("./Middleware/error");
const { onConnect, socketMiddleware } = require("./Utils/Socket");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL not found: ${req.url}`, 404));
});
app.use(generatedError);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

io.use(socketMiddleware);

io.on("connection", onConnect);
