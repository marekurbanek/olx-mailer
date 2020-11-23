const puppeteer = require("puppeteer");
const makeDb = require("./db");
const sendNewPostEmail = require("./mailer");

const getPostsData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const db = await makeDb();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.goto(
    "https://www.olx.pl/nieruchomosci/garaze-parkingi/sprzedaz/swietochlowice/?search%5Bfilter_float_price%3Afrom%5D=12000&search%5Border%5D=created_at%3Adesc&search%5Bdist%5D=5"
  );

  async function findAndSavePostsFromCurrentPage() {
    console.log("FINDING NEW POSTS");
    const posts = await page.evaluate(() => {
      let posts = [];
      const postsElements = document.querySelectorAll("[summary=Ogłoszenie]");
      postsElements.forEach((post) => {
        const title = post.querySelector('[data-cy="listing-ad-title"]').firstElementChild.textContent;
        const link = post.querySelector('[data-cy="listing-ad-title"]').getAttribute("href");
        const price = post.querySelector(".price").innerText;
        const location = post.querySelectorAll(".x-normal")[1].innerText;
        posts.push({ title, price, location, link });
      });
      return posts;
    });

    await posts.forEach(async (post) => {
      const alreadySaved = await db.collection("posts").findOne({ title: post.title });
      if (!alreadySaved) {
        console.log("New Post", post.title);
        await db.collection("posts").insertOne(post);
        await sendNewPostEmail(post);
      } else {
        console.log('Post already saved');
      }
    });
    return;
  }

  await findAndSavePostsFromCurrentPage();
  return browser.close();
};

module.exports = getPostsData;
