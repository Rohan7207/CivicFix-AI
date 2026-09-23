require("dotenv").config({ path: "./server/.env" });

const analyzeImage = require("./analyzeImage");

const imageUrl =
  "https://ik.imagekit.io/gprbfmzq5/complaints/photos/Pathhole_J-b9ShQUxq.jpg";

async function test() {
  try {
    const result = await analyzeImage(imageUrl);
  } catch (error) {
    console.error("\nIMAGE AI ERROR:");
    console.error(error.message);
  }
}

test();
