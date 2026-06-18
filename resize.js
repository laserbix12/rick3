const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");

async function resizeIcons() {
  const sourcePath = path.join(__dirname, "public", "favicon.png");
  const iconsPath = path.join(__dirname, "public", "icons");
  
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  try {
    const image = await Jimp.read(sourcePath);
    
    for (const size of sizes) {
      const destPath = path.join(iconsPath, `icon-${size}x${size}.png`);
      const clone = image.clone();
      clone.resize({ w: size, h: size });
      await clone.write(destPath);
      console.log(`Resized and saved: ${destPath}`);
    }
    console.log("All icons resized successfully!");
  } catch (error) {
    console.error("Error resizing icons:", error);
  }
}

resizeIcons();
