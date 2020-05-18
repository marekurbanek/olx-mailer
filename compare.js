const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");
var webp = require("webp-converter");

async function getDiff() {
  webp.dwebp("wiata1.webp", "wiata.jpg", "-o", function (status, error) {
    //if conversion successful status will be '100'
    //if conversion fails status will be '101'
    console.log(status, error);
    compare();
  });
}

async function compare() {
  const options = {
    output: {
      errorColor: {
        red: 255,
        green: 0,
        blue: 255,
      },
      errorType: "movement",
      transparency: 0.3,
      largeImageThreshold: 1200,
      useCrossOrigin: false,
      outputDiff: true,
    },
    scaleToSameSize: false,
    // ignore: "antialiasing",
  };

  const data = await compareImages(
    await fs.readFile("People1.jpg"),
    await fs.readFile("People2.jpg"),
    options
  );
  console.log(data);

  await fs.writeFile("./output.png", data.getBuffer());
}

getDiff();
