const getPostsData = require("./postsSaver");
const dotenv = require("dotenv");

async function main() {
  dotenv.config();

  getPostsData();
  setInterval(() => {
    getPostsData();
  }, 0.5 * 60000);
}

main();
