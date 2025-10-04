const express = require("express");

async function main() {
  const app = express;

  app.listen(3000, () => {
    console.log("server runing on port http://localhost:3000");
  });
}
main();
