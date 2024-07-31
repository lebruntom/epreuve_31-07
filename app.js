const express = require("express");
const server = require("./server");

const app = express();

app.use("/tlebrun", server);
app.listen(3000, () => {
  console.info("server démarré");
});

module.exports = app;
