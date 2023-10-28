import app from "./app.js";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception! 💥 Sutting down server...");
  console.log(err.name + "💥 : " + err.message);
  process.exit(1); // code 0 stands for a success and code 1 stands for unhandled exception
});

// dotenvExpand.expand(dotenv.config());
dotenvExpand.expand(dotenv.config({ path: "./.env" }));

// get data from .env file
const port = process.env.PORT || "3000";
const host = process.env.HOST || "localhost";

// start server
const server = app.listen(port, () => {
  console.log(`Listening on http://${host}:${port}`);
});

// to handle unhandled rejected promises.
// to listing unhandledRejection event which then allows us to handle all the errors that occur in asynchronous code which were not previously handled .
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection! 💥 Sutting down server...");
  console.log(err.name + "💥 : " + err.message);
  // server.close basically gives time to finish all the requests that are still pending oe being handled at a time and only after that the server is then basically killed.
  server.close(() => {
    process.exit(1); // code 0 stands for a success and code 1 stands for unhandled exception
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED, Shutting down gracefully');
  // because some server providing platforms restarts our app in every 24hours for keep our app in healthy state
  // for that they sends SIGTERM signal and shutdown server immediately
  // so this can then leave requests that are currently in processed basically hanging in the air
  // To prevent that situation when we get that signal we close the server so we don't have to face in problem while server restart    
  server.close(() => {
    console.log('💥 Process terminated');
  });
})