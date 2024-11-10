const app = require("./app");
const { connectDatabase } = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(err);
});

(async () => {
  await connectDatabase();
})();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log("App is listening on port", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});
