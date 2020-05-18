const puppeteer = require("puppeteer");
const makeDb = require("./db");

const getPostsData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const db = await makeDb();

  await page.goto(
    "https://www.olx.pl/nieruchomosci/garaze-parkingi/sprzedaz/swietochlowice/?search%5Bdist%5D=5"
  );
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  let allPosts;
  async function getPostsFromCurrentPage() {
    return await page.evaluate(() => {
      let posts = [];
      const postsElements = document.querySelectorAll("[summary=Ogłoszenie]");
      postsElements.forEach((post) => {
        const title = post.querySelector('[data-cy="listing-ad-title"]')
          .firstElementChild.textContent;
        const price = post.querySelector(".price").innerText;
        const location = post.querySelectorAll(".x-normal")[1].innerText;
        posts.push({ title, price, location });
      });
      return posts;
    });
  }
  // First page
  const pagePosts = await getPostsFromCurrentPage();
  allPosts = [...pagePosts];

  const isNextPage = await page.evaluate(
    () => document.querySelectorAll("a.pageNextPrev").length > 1
  );

  while (isNextPage) {
    await page.evaluate(() =>
      document.querySelectorAll("a.pageNextPrev")[1].click()
    );
    const pagePosts = await getPostsFromCurrentPage();

    allPosts = [...allPosts, ...pagePosts];
  }
  if (!isNextPage) {
    const pagePosts = await getPostsFromCurrentPage();
    allPosts = [...allPosts, ...pagePosts];
  }

  await allPosts.forEach(async (post) => {
    const alreadySaved = await db
      .collection("posts")
      .findOne({ title: post.title });

    if (!alreadySaved) {
      console.log("New Post");
      console.log(post.title);
      await db.collection("posts").insertOne(post);
    } else {
      console.log("Already saved");
    }
  });
  // db.collection("posts").insertMany(allPosts);

  // console.log(allPosts);
  await browser.close();
};

module.exports = getPostsData;
